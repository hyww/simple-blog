let server = '';
if(process.env.NODE_ENV==='development')
  server = 'http://localhost:5000'

export default server;
