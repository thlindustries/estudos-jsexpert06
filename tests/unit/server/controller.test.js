import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import {join} from 'path';

import { Controller } from '../../../server/controller.js';
import { Service } from '../../../server/service';
import TestUtil from '../_util/testUtil.js';
import config from '../../../server/config.js';

const controller = new Controller();

describe('#Controller - test suite for controller', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  })

  test(`getFileStream - given a fileName it should return an object with a fileStream and a type`, async () => {
    const fileName = '/index';
    const fileType = '.html';

    const mockFileStream = TestUtil.generateReadableStream(['data']);

    jest.spyOn(
      Service.prototype,
      Service.prototype.getFileStream.name,
    ).mockResolvedValue({
      stream: mockFileStream,
      type: fileType
    });

    const data = await controller.getFileStream(join(config.dir.publicDirectory, (fileName + fileType)));

    expect(Service.prototype.getFileStream).toBeCalled();
    expect(data).toStrictEqual({
      stream: mockFileStream,
      type: fileType
    });
  });
});