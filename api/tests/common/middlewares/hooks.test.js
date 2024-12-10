import { expect } from "chai";
import { registerHooks } from "../../../src/common/middlewares/hooks.js";
import sinon from "sinon";

describe("Register Hooks", () => {
  let fastify;
  let request;
  let reply;

  beforeEach(() => {
    fastify = {
      addHook: sinon.stub(),
    };
    request = {
      url: "",
      jwtVerify: sinon.stub(),
    };
    reply = {
      code: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
  });

  it("should add the onRequest hook", async () => {
    // Act
    registerHooks(fastify);

    // Assert
    expect(fastify.addHook.calledOnceWith("onRequest", sinon.match.func)).to.be
      .true;
  });

  describe("On Request Behaviour", () => {
    let onRequestHook;

    beforeEach(() => {
      registerHooks(fastify);
      onRequestHook = fastify.addHook.firstCall.args[1];
    });

    it("should skip authentication token for excluded path", async () => {
      // Arrange
      const testCases = ["/docs", "/api/auth/*"];
      testCases.forEach(async (url) => {
        reply.code.resetHistory();
        reply.send.resetHistory();
        request.url = url;

        // Act
        await onRequestHook(request, reply);

        // Assert
        expect(request.jwtVerify.called).to.be.false;
        expect(reply.code.called).to.be.false;
        expect(reply.send.called).to.be.false;
      });
    });

    it("should call jwtVerify for non-excluded path", async () => {
      // Arrange
      request.url = "/api/users";

      // Act
      await onRequestHook(request, reply);

      // Assert
      expect(request.jwtVerify.calledOnce).to.be.true;
      expect(reply.code.called).to.be.false;
      expect(reply.send.called).to.be.false;
    });

    it("should respond with 401 if jwtVerify fails", async () => {
      // Arrange
      request.url = "/api/users";
      request.jwtVerify.rejects(new Error("JWT Error")); // Simulate verification failure

      // Act
      await onRequestHook(request, reply);

      // Assert
      expect(request.jwtVerify.calledOnce).to.be.true;
      expect(reply.code.calledOnceWith(401)).to.be.true;
      expect(reply.send.calledOnceWith("Unauthorized"));
    });
  });
});
