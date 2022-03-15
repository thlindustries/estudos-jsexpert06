import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import { join } from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

import config from '../../../server/config.js';
import { Service } from '../../../server/service.js';
import TestUtil from '../_util/testUtil.js';

const service = new Service();

describe('#Serivce - test suite for service', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  })

  test(`getFileStream - given a file it should return an object with a readableStream and a type`, async () => {
    const fileName = '/index';
    const fileType = '.html';
    const fullFilePath = join(config.dir.publicDirectory, (fileName + fileType));

    const readableStream = TestUtil.generateReadableStream(['data']);

    jest.spyOn(
      fsPromises,
      fsPromises.access.name
    ).mockResolvedValue();

    jest.spyOn(
      fs,
      fs.createReadStream.name
    ).mockReturnValue(readableStream);

    const data = await service.getFileStream(fileName + fileType);

    expect(fs.createReadStream).toBeCalledWith(fullFilePath);
    expect(data).toStrictEqual({
      type: fileType,
      stream: readableStream
    });
  });
  test(`getFileInfo - given a file it should return an object with name and type`, async () => {
    const fileName = '/index';
    const fileType = '.html';
    const fullFilePath = join(config.dir.publicDirectory, (fileName + fileType));

    jest.spyOn(
      fsPromises,
      fsPromises.access.name,
    ).mockResolvedValue();

    const data = await service.getFileInfo(fileName + fileType);

    expect(fsPromises.access).toBeCalledWith(fullFilePath);
    expect(data).toStrictEqual({
      type: fileType,
      name: fullFilePath
    });
  });
});