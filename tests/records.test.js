const { recordsLogic } = require("../logics");
const { recordsModel } = require("../schema");

describe("Record Model", () => {
  let recordsMockData = [
    {
      key: "pxClAvll",
      createdAt: "2016-12-19T10:00:40.050Z",
      totalCount: 2772,
    },
    {
      key: "plaqeWiK",
      createdAt: "2016-11-20T07:45:28.618Z",
      totalCount: 2773,
    },
  ];

  let mockData = {
    code: 0,
    msg: "Success",
    records: recordsMockData,
  };

  it("Get Records Success", async () => {
    let mockBody = {
      startDate: "2016-01-26",
      endDate: "2018-02-02",
      minCount: 2700,
      maxCount: 3000,
    };
    jest.spyOn(recordsModel, "aggregate").mockResolvedValue(recordsMockData);
    const records = await recordsLogic.getRecords(mockBody);
    expect(records).toEqual(mockData);
  });

  it("Get Records with Invalid Input data", async () => {
    let mockBody = {};
    try {
      jest.spyOn(recordsModel, "aggregate").mockResolvedValue(recordsMockData);
      await recordsLogic.getRecords(mockBody);
    } catch (e) {
      expect(e.message).toMatch("Input data is missing");
    }
  });

  it("Get Records with Invalid date format", async () => {
    let mockBody = {
      startDate: "assa",
      endDate: "2018-02-02",
      minCount: 2700,
      maxCount: 3000,
    };

    try {
      jest.spyOn(recordsModel, "aggregate").mockResolvedValue(recordsMockData);
      await recordsLogic.getRecords(mockBody);
    } catch (e) {
      expect(e.message).toMatch("Please send valid date format");
    }
  });

  it("Get Records with Invalid max or min count", async () => {
    let mockBody = {
      startDate: "2016-01-26",
      endDate: "2018-02-02",
      minCount: "as",
      maxCount: "be",
    };
    try {
      jest.spyOn(recordsModel, "aggregate").mockResolvedValue(recordsMockData);
      await recordsLogic.getRecords(mockBody);
    } catch (e) {
      expect(e.message).toMatch(
        "Please send mincount or maxcount in integer format"
      );
    }
  });
});
