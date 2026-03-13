import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Job } from './models/Job';
import { JobCategory, JobType } from './types';

dotenv.config();

const sampleJobs: Array<{
	title: string;
	company: string;
	company_logo: string;
	location: string;
	category: JobCategory;
	type: JobType;
	description: string;
	requirements: string;
	salary: string;
}> = [
	{
		title: 'Senior TypeScript Engineer',
		company: 'Vercel',
		company_logo: 'https://api.vercel.com/www/logomark-light.png',
		location: 'Remote',
		category: JobCategory.Engineering,
		type: JobType.FullTime,
		description:
			'Join our platform team to build the infrastructure powering the modern web. You will work on Next.js core, Edge Runtime, and developer tooling used by millions. We care deeply about performance, reliability, and developer experience at massive scale.',
		requirements:
			'5+ years TypeScript/Node.js\nDeep understanding of V8 and runtime performance\nExperience with distributed systems\nPassion for developer tooling',
		salary: '$160k – $220k',
	},
	{
		title: 'Product Designer',
		company: 'Linear',
		company_logo: 'https://logotyp.us/files/linear/image.svg',
		location: 'San Francisco, CA',
		category: JobCategory.Design,
		type: JobType.FullTime,
		description:
			'Linear is hiring a product designer to help craft the best project management tool for high-performance software teams. You will own design for key product areas, working closely with engineers to ship polished, thoughtful experiences. Our design bar is very high and we care deeply about craft.',
		requirements:
			'3+ years product design\nProficiency in Figma\nStrong systems thinking\nExperience with complex B2B tools',
		salary: '$130k – $170k',
	},
	{
		title: 'Data Scientist',
		company: 'Stripe',
		company_logo:
			'https://b.stripecdn.com/site-statics/images/branding/brand-resources/logo-mark/logo-mark.png',
		location: 'New York, NY',
		category: JobCategory.Data,
		type: JobType.FullTime,
		description:
			'Help Stripe understand and grow its business through data. You will build models to detect fraud, forecast revenue, and surface insights across billions of transactions. You will have massive impact working alongside world-class engineers on a product used by millions of businesses.',
		requirements:
			'MS/PhD in quantitative field\nStrong Python and SQL skills\nExperience with ML frameworks (PyTorch, scikit-learn)\nSolid statistical foundation',
		salary: '$160k – $220k',
	},
	{
		title: 'Growth Marketing Manager',
		company: 'Notion',
		company_logo:
			'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
		location: 'Remote',
		category: JobCategory.Marketing,
		type: JobType.FullTime,
		description:
			"Drive Notion's growth by owning key acquisition channels. You will run experiments across paid social, SEO, and partnerships to grow our user base. This is a high-impact role for someone who loves both strategy and getting their hands dirty in the data.",
		requirements:
			'4+ years growth/performance marketing\nExperience with A/B testing\nStrong analytical skills\nSQL familiarity a plus',
		salary: '$110k – $145k',
	},
	{
		title: 'Backend Engineer (Rust)',
		company: 'Discord',
		company_logo: 'https://cdn.worldvectorlogo.com/logos/discord-6.svg',
		location: 'Remote',
		category: JobCategory.Engineering,
		type: JobType.FullTime,
		description:
			"Work on Discord's core infrastructure serving 500M+ registered users. You will build and maintain high-performance services in Rust, optimizing for latency and reliability at scale. Our backend team tackles fascinating distributed systems challenges.",
		requirements:
			'3+ years backend engineering\nRust experience or eagerness to learn\nDistributed systems knowledge\nExperience with databases and message queues',
		salary: '$170k – $230k',
	},
	{
		title: 'iOS Engineer',
		company: 'Figma',
		company_logo: 'https://www.figma.com/favicon.ico',
		location: 'San Francisco, CA',
		category: JobCategory.Engineering,
		type: JobType.FullTime,
		description:
			'Build the next generation of Figma for iOS. You will work on our mobile editing experience, collaborative features, and performance — helping designers work seamlessly on any device. Join a team that shipped one of the most technically impressive mobile apps.',
		requirements:
			'4+ years native iOS\nDeep Swift and UIKit/SwiftUI knowledge\nGraphics or rendering experience a plus\nStrong attention to design quality',
		salary: '$155k – $210k',
	},
	{
		title: 'Head of Sales',
		company: 'Retool',
		company_logo: 'https://cdn.worldvectorlogo.com/logos/retool.svg',
		location: 'New York, NY',
		category: JobCategory.Sales,
		type: JobType.FullTime,
		description:
			"Lead and scale Retool's enterprise sales organization. You will hire and develop world-class AEs and SDRs, build repeatable sales processes, and close strategic deals with Fortune 500 companies. This is a player-coach role for an experienced sales leader.",
		requirements:
			'8+ years B2B SaaS sales\n3+ years in sales leadership\nProven record of exceeding quota\nExperience selling to technical buyers',
		salary: '$180k – $260k OTE',
	},
	{
		title: 'DevRel Engineer',
		company: 'Supabase',
		company_logo: 'https://cdn.worldvectorlogo.com/logos/supabase-2.svg',
		location: 'Remote',
		category: JobCategory.Engineering,
		type: JobType.Remote,
		description:
			'Be the bridge between Supabase and our global developer community. Create tutorials, build demos, speak at conferences, and help developers succeed. You are a developer who loves teaching and community building as much as shipping code.',
		requirements:
			'Strong software development background\nExcellent technical writing\nComfort with public speaking\nActive in developer communities',
		salary: '$100k – $140k',
	},
	{
		title: 'Frontend Engineer (React)',
		company: 'Loom',
		company_logo: 'https://cdn.worldvectorlogo.com/logos/loom-2.svg',
		location: 'Remote',
		category: JobCategory.Engineering,
		type: JobType.Remote,
		description:
			'Join Loom to make work communication more human. You will build fast, delightful React interfaces for our video recording and sharing product used by millions of teams worldwide. We value clean code, thoughtful design, and meaningful user impact.',
		requirements:
			'3+ years React experience\nStrong TypeScript skills\nPerformance optimization mindset\nExperience with video or media a bonus',
		salary: '$130k – $175k',
	},
	{
		title: 'UX Researcher',
		company: 'Intercom',
		company_logo: 'https://cdn.worldvectorlogo.com/logos/intercom.svg',
		location: 'Dublin, Ireland',
		category: JobCategory.Design,
		type: JobType.FullTime,
		description:
			'Help Intercom deeply understand its customers. You will conduct qualitative and quantitative research, synthesize insights, and work with PMs and designers to shape the product roadmap. Your research will directly influence how millions of businesses communicate with their customers.',
		requirements:
			'3+ years UX research experience\nProficiency in qual and quant methods\nStrong communication skills\nExperience with B2B SaaS products preferred',
		salary: '€70k – €95k',
	},
];

async function seed(): Promise<void> {
	const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/quickhire';

	try {
		await mongoose.connect(uri);
		console.log('✅ Connected to MongoDB');

		await Job.deleteMany({});
		console.log('🗑  Cleared existing jobs');

		const jobs = await Job.insertMany(sampleJobs);
		console.log(`🌱 Seeded ${jobs.length} sample jobs`);

		await mongoose.disconnect();
		console.log('✅ Done! Database disconnected.');
	} catch (error) {
		console.error('❌ Seed error:', error);
		process.exit(1);
	}
}

seed();
