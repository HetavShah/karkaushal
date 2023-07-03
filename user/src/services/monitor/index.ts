import express,{Request,Response} from 'express';
import client from 'prom-client';

const app = express();

export function metricsService(){
  const collectDefaultMetrics= client.collectDefaultMetrics;
  collectDefaultMetrics();

  app.get('/user/metrics',async(req:Request,res:Response)=>{
    res.set('Content-Type',client.register.contentType);

    return res.send(await client.register.metrics());
  });

  app.listen(9000,()=>{
    console.log('Metrics Service listening on http://localhost:9000');
  })
}