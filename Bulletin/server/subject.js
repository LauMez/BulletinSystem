import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import { SubjectModel } from '../models/gRPC/subject.js';

const packageDefinition = protoLoader.loadSync('../protos/subject.proto', {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const subjectservice = grpc.loadPackageDefinition(packageDefinition).subjectservice;

const server = new grpc.Server();

server.addService(subjectservice.SubjectService.service, {
  GetAll: async(call, callback) => {
    try{
      const subjects = await SubjectModel.getAll();
      callback(null, subjects);
    } catch (error) {
      console.error('Error processing subjects:', error);
      callback({ code: grpc.status.INTERNAL, details: "Internal error" });
    };
  },   
  GetByID: async(call, callback) => {
    const { subjectID } = call.request;
    try{
      const subject = await SubjectModel.getByID({subjectID});
      callback(null, subject);
    } catch (error) {
      console.error('Error processing subject:', error);
      callback({ code: grpc.status.INTERNAL, details: "Internal error" });
    };
  }
});

const port = '50051';
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log(`Item service running at http://0.0.0.0:${port}`);
});