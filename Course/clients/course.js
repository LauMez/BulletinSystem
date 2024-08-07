import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('../Course/proto/course.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

const courseservice = grpc.loadPackageDefinition(packageDefinition).courseservice;

const port = process.env.RPC_PORT || '50061';
export default new courseservice.CourseService(`localhost:${port}`, grpc.credentials.createInsecure());