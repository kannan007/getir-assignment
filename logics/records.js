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

  if (!startDate || !endDate || !minCount || !maxCount)
    throw new Error(`Input data is missing`);

  if (!isValidDate(new Date(startDate)) || !isValidDate(new Date(endDate)))
    throw new Error(`Please send valid date format`);

  minCount = +minCount;
  maxCount = +maxCount;

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
      ...paginationPipeline
    ])
    .catch((err) => {
      throw new Error(`Error fetching Records`);
    });

  return { code: 0, msg: "Success", records };
};

module.exports = {
  getRecords,
};
