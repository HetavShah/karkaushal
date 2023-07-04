import express,{Request,Response} from 'express';
import client from 'prom-client';

const app = express();

export const restResponseTimeHistogram= new client.Histogram({
name:'rest_response_time_duration_seconds',
help:'REST API response time in seconds',
labelNames: ['method','route','status_code'],
});
export const databseResponseTimeHistogram= new client.Histogram({
name:'db_response_time_duration_seconds',
help:'DB response time in seconds',
labelNames: ['operation','success'],
});

export function metricsService(){
  const collectDefaultMetrics= client.collectDefaultMetrics;
  collectDefaultMetrics();

  app.get('/metrics',async(req:Request,res:Response)=>{
    res.set('Content-Type',client.register.contentType);

    return res.send(await client.register.metrics());
  });
  

  app.listen(9000,()=>{
    console.log('Metrics Service listening on http://localhost:9000');
  })
}