import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import {createReadStream} from 'fs';

import config from '../../../server/config.js';
import { Controller } from '../../../server/controller.js';
import {Service} from '../../../server/service.js';
import { handler } from '../../../server/routes.js';
import TestUtil from '../_util/testUtil.js';

const { pages } = config;

describe('#Routes - test suite for api response', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  })

  test(`GET / - should redirect to home page`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    params.request.url = '/';

    await handler(...params.values());

    expect(params.response.end).toHaveBeenCalled();
    expect(params.response.writeHead).toHaveBeenCalledWith(302, {
      'Location': config.location.home
    });

  });
  test(`GET /home - should response with ${pages.homeHTML} fileStream`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    params.request.url = '/home';

    const mockFileStream = TestUtil.generateReadableStream(['data']);

    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name,
    ).mockResolvedValue({
      stream: mockFileStream,
    });

    jest.spyOn(
      mockFileStream,
      "pipe"
    ).mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(config.pages.homeHTML);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
  });
  test(`GET /controller - should response with ${pages.controllerHTML} fileStream`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    params.request.url = '/controller';

    const mockFileStream = TestUtil.generateReadableStream(['data']);

    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name,
    ).mockResolvedValue({
      stream: mockFileStream,
    });

    jest.spyOn(
      mockFileStream,
      "pipe"
    ).mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(config.pages.controllerHTML);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);

  });
  test(`GET /index.html - should response with fileStream`, async () => {
    const params = TestUtil.defaultHandleParams();
    const fileName = '/index.html';
    params.request.method = 'GET';
    params.request.url = fileName;

    const expectedType = '.html';

    const mockFileStream = TestUtil.generateReadableStream(['data']);

    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name,
    ).mockResolvedValue({
      stream: mockFileStream,
      type: expectedType
    });

    jest.spyOn(
      mockFileStream,
      "pipe"
    ).mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(fileName);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    expect(params.response.writeHead).toHaveBeenCalledWith(200, {
      'Content-Type': config.constants.CONTENT_TYPE[expectedType]
    });

  });
  test(`GET /file.ext - should response with fileStream`, async () => {
    const params = TestUtil.defaultHandleParams();
    const fileName = '/file.ext';
    params.request.method = 'GET';
    params.request.url = fileName;

    const expectedType = '.ext';

    const mockFileStream = TestUtil.generateReadableStream(['data']);

    jest.spyOn(
      Controller.prototype,
      Controller.prototype.getFileStream.name,
    ).mockResolvedValue({
      stream: mockFileStream,
      type: expectedType
    });

    jest.spyOn(
      mockFileStream,
      "pipe"
    ).mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(fileName);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    expect(params.response.writeHead).not.toHaveBeenCalledWith(200, {
      'Content-Type': config.constants.CONTENT_TYPE[expectedType]
    });

  });
  test(`POST /unknow - given an inexistent route it should response with 404`, async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'POST';
    params.request.url = '/unknow';

    await handler(...params.values());

    expect(params.response.writeHead).toHaveBeenCalledWith(404);
    expect(params.response.end).toHaveBeenCalled();

  });

  describe('exceptions', () => {
    test('given an inexistent file it should response with 404', async () => {
      const params = TestUtil.defaultHandleParams();
      params.request.method = 'GET';
      params.request.url = '/index.png';

      jest.spyOn(
        Controller.prototype,
        Controller.prototype.getFileStream.name
      ).mockRejectedValue(new Error('Error: ENOENT: no such file or directory'));

      await handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(404);
      expect(params.response.end).toHaveBeenCalled();

    });
    test('given an error it should response with 500', async () => {
      const params = TestUtil.defaultHandleParams();
      params.request.method = 'GET';
      params.request.url = '/index.png';

      jest.spyOn(
        Controller.prototype,
        Controller.prototype.getFileStream.name
      ).mockRejectedValue(new Error('Error:'));

      await handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(500);
      expect(params.response.end).toHaveBeenCalled();

    });
  });
});