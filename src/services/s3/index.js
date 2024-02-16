'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
var client_s3_1 = require('@aws-sdk/client-s3');
require('dotenv/config');
var Errors_1 = require('../../types/classes/Errors');
var s3_presigned_post_1 = require('@aws-sdk/s3-presigned-post');
var s3_request_presigner_1 = require('@aws-sdk/s3-request-presigner');
var S3 = /** @class */ (function () {
  function S3(s3Client) {
    var _this = this;
    this.s3Client = s3Client;
    this.getImageUrl = function (bucket, key) {
      return __awaiter(_this, void 0, void 0, function () {
        var command, url;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              command = new client_s3_1.GetObjectCommand({ Bucket: bucket, Key: key });
              return [
                4 /*yield*/,
                (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: 3600 }),
              ];
            case 1:
              url = _a.sent();
              return [2 /*return*/, url];
          }
        });
      });
    };
    this.getImage = function (bucket, key) {
      return __awaiter(_this, void 0, void 0, function () {
        var command, response, uint8Arr, buffer;
        var _a;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              command = new client_s3_1.GetObjectCommand({ Bucket: bucket, Key: key });
              return [4 /*yield*/, this.s3Client.send(command)];
            case 1:
              response = _b.sent();
              return [
                4 /*yield*/,
                (_a = response === null || response === void 0 ? void 0 : response.Body) === null || _a === void 0
                  ? void 0
                  : _a.transformToByteArray(),
              ];
            case 2:
              uint8Arr = _b.sent();
              if (!uint8Arr) throw new Errors_1.ServerError('cant get image from s3');
              buffer = Buffer.from(uint8Arr);
              return [2 /*return*/, buffer];
          }
        });
      });
    };
    this.uploadImage = function (buffer, bucket, key) {
      return __awaiter(_this, void 0, void 0, function () {
        var command;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              command = new client_s3_1.PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: buffer,
              });
              return [4 /*yield*/, this.s3Client.send(command)];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    };
    this.presignedPost = function (expires, key, bucket, contentType) {
      return __awaiter(_this, void 0, void 0, function () {
        var options;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              options = {
                Fields: { 'Content-Type': contentType },
                Bucket: bucket,
                Expires: expires,
                Key: key,
                Conditions: [
                  ['starts-with', '$Content-Type', 'image/'],
                  ['content-length-range', 0, 10485760],
                ],
              };
              return [4 /*yield*/, (0, s3_presigned_post_1.createPresignedPost)(this.s3Client, options)];
            case 1:
              return [2 /*return*/, _a.sent()];
          }
        });
      });
    };
  }
  return S3;
})();
exports['default'] = S3;
