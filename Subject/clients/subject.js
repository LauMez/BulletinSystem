import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

const packageDefinition = protoLoader.loadSync('../Subject/proto/subject.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });

const subjectservice = grpc.loadPackageDefinition(packageDefinition).subjectservice;

const port = process.env.RPC_PORT || '50060';
export default new subjectservice.SubjectService(`localhost:${port}`, grpc.credentials.createInsecure());