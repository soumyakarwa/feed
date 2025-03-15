import type { PageServerLoad } from './$types';
import 'dotenv/config';
import { google } from 'googleapis';

// Configure OAuth2
const auth = new google.auth.OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.REDIRECT_URI
);

auth.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
const refreshAccessToken = async () => {
	try {
		const { credentials } = await auth.refreshAccessToken();
		auth.setCredentials(credentials);
		console.log('✅ New Access Token:', credentials.access_token);
		return credentials.access_token;
	} catch (error) {
		console.error('❌ Error refreshing access token:', error);
		return null;
	}
};

export const load: PageServerLoad = async () => {
	try {
		let accessToken = auth.credentials.access_token;
		if (!accessToken) {
			console.log('🔄 Refreshing token...');
			accessToken = await refreshAccessToken();
		}

		if (!accessToken) throw new Error('Failed to retrieve a valid access token');

		const gmail = google.gmail({ version: 'v1', auth });
		console.log('Fetching latest email...');

		const messagesResponse = await gmail.users.messages.list({
			userId: 'me',
			maxResults: 1
		});

		// console.log('Messages Response:', messagesResponse.data);

		if (!messagesResponse.data.messages) {
			return { email: 'No emails found' };
		}

		const emailId = messagesResponse.data.messages[0].id;

		const emailDetails = await gmail.users.messages.get({
			userId: 'me',
			id: emailId,
			format: 'metadata', // Only fetch headers, no email body
			metadataHeaders: ['From', 'Subject']
		});

		console.log('Email Details:', emailDetails.data);

		const headers = emailDetails.data.payload?.headers || [];
		const fromHeader = headers.find((header) => header.name === 'From');
		const subjectHeader = headers.find((header) => header.name === 'Subject');

		const from = fromHeader ? fromHeader.value : 'Unknown Sender';
		const subject = subjectHeader ? subjectHeader.value : 'No Subject';

		return {
			email: {
				id: emailId,
				from,
				subject
			}
		};
	} catch (error) {
		console.error('❌ ERROR fetching email:', error);
		return { error: 'Failed to fetch email' };
	}
};
