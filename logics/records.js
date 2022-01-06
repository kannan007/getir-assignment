const { recordsModel } = require("../schema");

const isValidDate = (date) => {
  return (
    date &&
    Object.prototype.toString.call(date) === "[object Date]" &&
    !isNaN(date)
  );
};

const getRecords = async (bodyData) => {
  let {
    startDate,
    endDate,
    minCount,
    maxCount,
    page = null,
    count = null,
  } = bodyData;

  let paginationPipeline = [];

  /* 
    As there are 4k records available in that collection its always better to use pagination however
    after checking with panel don't change the input data so i wrote it as optional if we get page and count from
    front end team will do pagination accordingly 
   */
  if (page && count) {
    const skip = (+page ? +page - 1 : +page) * +count;
    const limit = +count;
    paginationPipeline.push(
      {
        $skip: skip,
      },
      {
        $limit: limit,
      }
    );
  }

  // Input Valid Data check
  if (!startDate || !endDate || !minCount || !maxCount)
    throw new Error(`Input data is missing`);

  // Valid date format check
  if (!isValidDate(new Date(startDate)) || !isValidDate(new Date(endDate)))
    throw new Error(`Please send valid date format`);

  minCount = +minCount;
  maxCount = +maxCount;

  // Valid Number check for min/max count
  if (!Number.isInteger(minCount) || !Number.isInteger(maxCount))
    throw new Error(`Please send mincount or maxcount in integer format`);

  const records = await recordsModel
    .aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $project: {
          _id: 0,
          createdAt: 1,
          key: 1,
          totalCount: { $sum: "$counts" },
        },
      },
      {
        $match: {
          totalCount: { $gte: minCount, $lte: maxCount },
        },
      },
      {
        $sort: { totalCount: 1 },
      },
      ...paginationPipeline,
    ])
    .catch((err) => {
      throw new Error(`Error fetching Records`);
    });

  return { code: 0, msg: "Success", records };
};

module.exports = {
  getRecords,
};
