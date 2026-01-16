import { v2 } from 'cloudinary'

v2.config({
    cloud_name: 'dclszdyzb',
    api_key: '193577243842688',
    api_secret: process.env.V2_SECRET,
});


export default v2