export default function generateInviteCode(): string {
	const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let randomString = '';
  
	for (let i = 0; i < 6; i++) {
		randomString += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
	}
  
	return randomString;
}