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
			maxResults: 500
		});

		// console.log('Messages Response:', messagesResponse.data);

		if (!messagesResponse.data.messages) {
			return { email: 'No emails found' };
		}

		let emails: any[] = await Promise.all(
			messagesResponse.data.messages.map(async (entry) => {
				console.log('Current entry', entry);

				const emailId = entry.id;
				const emailDetails = await gmail.users.messages.get({
					userId: 'me',
					id: emailId,
					format: 'metadata', // Only fetch headers, no email body
					metadataHeaders: ['From', 'Subject']
				});

				const headers = emailDetails.data.payload?.headers || [];
				const fromHeader = headers.find((header) => header.name === 'From');
				const subjectHeader = headers.find((header) => header.name === 'Subject');

				return {
					id: emailId,
					from: fromHeader ? fromHeader.value : 'Unknown Sender',
					subject: subjectHeader ? subjectHeader.value : 'No Subject',
					receivedTime: new Date(parseInt(emailDetails.data.internalDate)).toLocaleString(), // Convert timestamp to readable format
					label: emailDetails.data.labelIds // Shows inbox, spam, or other labels
				};
			})
		);

		return { emails };
	} catch (error) {
		console.error('❌ ERROR fetching email:', error);
		return { error: 'Failed to fetch email' };
	}
};
