const { ux, sdk } = require('@cto.ai/sdk');
const { OPERATIONS } = require('./constants');
const jenkinsapi = require('jenkins');

const main = async () => {
	//Startup
	await ux.print(`🤖 Jenkins Bot! 📦`);
	if (
		process.env.JENKINS_DOMAIN === '$JENKINS_DOMAIN' ||
		process.env.JENKINS_USERNAME === '$JENKINS_USERNAME' ||
		process.env.JENKINS_PASSWORD === '$JENKINS_PASSWORD'
	) {
		await ux.print(
			`🔴 Not sure where to run the bot! Please specify JENKINS_DOMAIN JENKINS_USERNAME JENKINS_PASSWORD`
		);
	}
	//TODO: Add error handling for jenkinsapi
	let jenkins;
	try {
		jenkins = jenkinsapi({
			baseUrl: `https://${process.env.JENKINS_USERNAME}:${process.env.JENKINS_PASSWORD}@${process.env.JENKINS_DOMAIN}`,
			crumbIssuer: true,
			formData: require('form-data'),
			promisify: true,
		});
	} catch (e) {
		await ux.print(`❗ ERROR: ${e}`);
	}
	await ux.print(`🏃 The bot is ready to run on ${process.env.JENKINS_DOMAIN}`);
	const jobsList = await jenkins.job.list();
	const jobsName = [];
	jobsList.forEach(function(jobsList) {
		jobsName.push(jobsList.name);
	});
	const { operations } = await ux.prompt({
		type: 'list',
		name: 'operations',
		message: '\n \n ❓What jenkins operation do you want to perform?',
		choices: OPERATIONS,
		default: 'checkStatus',
	});
	await ux.print(`\n 👌 Okay.`);
	const { jenkinsJob } = await ux.prompt({
		type: 'list',
		name: 'jenkinsJob',
		message: '\n \n 💼On which job?',
		choices: jobsName,
	});
	if (operations === 'checkStatus') {
		const status = await jenkins.job.get(jenkinsJob);
		if (status.color === 'red') {
			await ux.print('\n 🔴 Last build failed!\n');
			await ux.print(`\n Last build URL:  ${status.lastBuild.url}`);
		} else if (status.color === 'green' || status.color == 'blue') {
			await ux.print('\n 💚 Last build passed!\n');
			await ux.print(`\n Last build URL:  ${status.lastBuild.url}`);
		} else {
			await ux.print('\n 🔶 Builds are unstable!\n');
			await ux.print(`\n Last build URL:  ${status.lastBuild.url}`);
		}
	} else if (operations === 'build') {
		let params = {};
		let moreParams = true;
		while (moreParams) {
			const { buildParams } = await ux.prompt({
				type: 'input',
				name: 'buildParams',
				message: `\n 🏗  Specify build parameter name. \n For example: If your job takes a value for BRANCH, specify BRANCH here.`,
			});
			const { paramValues } = await ux.prompt({
				type: 'input',
				name: 'paramValues',
				message: `\n 🏗  Enter value for the build parameter: ${buildParams}`,
			});
			params[buildParams] = paramValues;
			const { more } = await ux.prompt({
				type: 'input',
				name: 'more',
				message: `\n ❔ Do you want to specify another build param (y/n)`,
			});
			if (more === 'n' || more === 'N') {
				moreParams = false;
			}
		}
		await ux.print(`\n 💼 Building ${jenkinsJob} with parameters: ${params}....`);
		await jenkins.job.build({
			name: jenkinsJob,
			parameters: params,
		});
		await ux.print(`\n 📗 Job Submitted successfully!`);
	} else {
		await ux.print('⏱ Yet to be implemented');
	}
};

main();
