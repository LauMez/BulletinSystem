import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { CourseModel } from '../models/gRPC/course.js';

const packageDefinition = protoLoader.loadSync('../protos/course.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const courseservice = grpc.loadPackageDefinition(packageDefinition).courseservice;

const server = new grpc.Server();

server.addService(courseservice.CourseService.service, {
  GetAll: async(call, callback) => {
    try{
      const courses = await CourseModel.getAll();
      callback(null, courses);
    } catch (error) {
      console.error('Error processing courses:', error);
      callback({ code: grpc.status.INTERNAL, details: "Internal error" });
    };
  },
  GetByID: async(call, callback) => {
    const { courseID } = call.request;
    try {
      const course = await CourseModel.getByID({ courseID });
      course.forEach(courseDetail => call.write(courseDetail));
      call.end();
    } catch (error) {
      console.error('Error processing course:', error);
      call.emit('error', { code: grpc.status.INTERNAL, details: "Internal error" });
    }
  }
});

const port = '50053';
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Item service running at http://0.0.0.0:${port}`);
});