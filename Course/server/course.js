import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { CourseModel } from '../models/mysql/course.js';

const packageDefinition = protoLoader.loadSync('../proto/course.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const courseservice = grpc.loadPackageDefinition(packageDefinition).courseservice;

const server = new grpc.Server();

server.addService(courseservice.CourseService.service, {
  GetByCourseGroupID: async(call, callback) => {
    const { courseGroupID } = call.request;
    try{
      const course = await CourseModel.getByCourseGroupID({courseGroupID});
      callback(null, course);
    } catch (error) {
      console.error('Error processing course:', error);
      callback({ code: grpc.status.INTERNAL, details: "Internal error" });
    };
  }
});

const port = process.env.RPC_PORT || '50061';
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Item service running at http://0.0.0.0:${port}`);
});