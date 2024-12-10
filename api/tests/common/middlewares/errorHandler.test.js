import HttpError from "../../../src/common/errors/httpError.js";
import errorHandler from "../../../src/common/middlewares/errorHandler.js";
import { expect } from "chai";
import sinon from "sinon";

describe("Middleware", () => {
  let reply;

  beforeEach(() => {
    reply = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
  });

  describe("Error Handler", () => {
    it("should handle validation errors", async () => {
      // Arrange
      const error = {
        validation: [
          { keyword: "if", message: "Error from if" },
          { keyword: "required", message: "Field is required" },
        ],
        statusCode: 400,
      };

      // Act
      errorHandler(error, {}, reply);

      // Assert
      expect(reply.status.calledOnceWith(400)).to.be.true;
      expect(
        reply.send.calledOnceWith({
          message: "Invalid input",
          statusCode: 400,
          details: ["Field is required"], // 'if' keyword filtered out
        })
      ).to.be.true;
    });

    it("should handle different HttpError errors", async () => {
      // Arrange
      const testCases = [
        {
          error: new HttpError("Unauthorized", 401),
          expectedStatusCode: 401,
          expectedMessage: "Unauthorized",
        },
        {
          error: new HttpError("Forbidden", 403),
          expectedStatusCode: 403,
          expectedMessage: "Forbidden",
        },
        {
          error: new HttpError("Not found", 404),
          expectedStatusCode: 404,
          expectedMessage: "Not found",
        },
      ];

      // Act
      testCases.forEach(({ error, expectedStatusCode, expectedMessage }) => {
        // Reset stubs for each iteration
        reply.status.resetHistory();
        reply.send.resetHistory();

        errorHandler(error, {}, reply);

        // Arrange
        expect(reply.status.calledOnceWith(expectedStatusCode)).to.be.true;
        expect(
          reply.send.calledOnceWith({
            message: expectedMessage,
            statusCode: expectedStatusCode,
          })
        ).to.be.true;
      });
    });

    it("should handle other errors with 500 status code", async () => {
      // Arrange
      const error = new Error("Oops something happened!");

      // Act
      errorHandler(error, {}, reply);

      // Assert
      expect(reply.status.calledOnceWith(500)).to.be.true;
      expect(
        reply.send.calledOnceWith({
          message: "Internal server error",
          statusCode: 500,
        })
      ).to.be.true;
    });
  });
});
