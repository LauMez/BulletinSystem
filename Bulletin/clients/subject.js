import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('protos/course.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

const courseservice = grpc.loadPackageDefinition(packageDefinition).courseservice;

export default new courseservice.CourseService('localhost:50053', grpc.credentials.createInsecure());