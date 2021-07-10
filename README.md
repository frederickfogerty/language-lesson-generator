<div align="center">
	<br>
		<img src="https://github.com/frederickfogerty/language-lesson-generator/raw/main/header.svg?sanitize=true" width="800" height="400" alt="Click to see the source">
	<br>
</div>

# Usage

1. Ensure you have npm, node, yarn, all the usual suspects installed
2. Something about Google Cloud
3. `yarn install`
4. Adjust config settings in `config.ts`
5. `npx ts-node index.ts`
6. Follow CLI instructions (see "Input Format" below)
7. See audio lesson saved in `output`

## Input format

Line-separated phrase pairs in the format `<known language (English)> - <target language>`

Example:

```
Waiter - de kelner
Waiters - de kelners
To stand - staan
I stood - ik stond
I have stood - Ik heb gestaan
Pain - de pijn
```
