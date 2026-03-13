import connectDB from './config/db';
import { createApp } from './app';
import { config } from './config/env';

async function bootstrap(): Promise<void> {
  try {
    await connectDB();

    const app = createApp();

    app.listen(config.port, () => {
      console.log(`🚀 QuickHire API running on http://localhost:${config.port}`);
      console.log(`   Environment : ${config.nodeEnv}`);
      console.log(`   Health check: http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
