const {uploadFile}=require('../../common/utility/upload.js')
const cloudinary=require('cloudinary')
const streamifier=require('streamifier')
jest.mock('cloudinary');
jest.mock('streamifier');

describe('uploadFile', () => {
  const mockFile = {
    originalname: 'testfile.pdf',
    buffer: Buffer.from('dummy content'),
  };

  let mockPipe;
  let mockStream;

  beforeEach(() => {
    mockPipe = jest.fn();
    mockStream = { pipe: mockPipe };
    streamifier.createReadStream.mockReturnValue(mockStream);
  });

  it('should resolve with result when upload is successful', async () => {
    const expectedResult = { url: 'http://cloudinary.com/testfile.pdf' };

    cloudinary.v2 = {
      uploader: {
        upload_stream: jest.fn((options, callback) => {
          // Simulate success async callback
          process.nextTick(() => callback(null, expectedResult));
          return {};
        }),
      },
    };

    const result = await uploadFile(mockFile);

    expect(streamifier.createReadStream).toHaveBeenCalledWith(mockFile.buffer);
    expect(result).toEqual(expectedResult);
  });

  it('should reject with error when upload fails', async () => {
    const expectedError = new Error('Upload failed');

    cloudinary.v2 = {
      uploader: {
        upload_stream: jest.fn((options, callback) => {
          // Simulate error async callback
          process.nextTick(() => callback(expectedError));
          return {};
        }),
      },
    };

    await expect(uploadFile(mockFile)).rejects.toThrow('Upload failed');
  });
});
