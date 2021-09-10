const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');

AWS.config.loadFromPath('aws.config.json');
const s3 = new AWS.S3();

// 이미지 저장경로, 파일명 세팅
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'sopt-join-seminar', // 버킷 이름
    contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
    acl: 'public-read', // 클라이언트에서 자유롭게 가용하기 위함
    key: (req, file, cb) => {
      cb(null, (Math.floor(Math.random() * 1000).toString() + Date.now()).toString());
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 용량 제한
});

export default upload;
