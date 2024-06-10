const fsPromises = require('fs').promises;

const fileOps = async () => {
    try {
        const data = await fsPromises.readFile('./files/temp.txt', 'utf8')
        console.log(data);
        await fsPromises.writeFile('./files/tempnew.txt', 'new file')
        await fsPromises.appendFile('./files/tempnew.txt', '\n\n adding info')
    } catch (err) {
        console.error(err)
    }
}

fileOps();