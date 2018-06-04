export default {
    host: 'smtp.hefantv.com',
    port: 465,
    account: {
        user: 'sendwarning@hefantv.com',
        pwd: 'ubBzS7ing',
    },
    mailInfo: {
        receivers: ['lichunwei@hefantv.com', 'songpeilan@hefantv.com', 
        'xuchangjian@hefantv.com', 'chenghaiyue@hefantv.com', 'guozongwei@hefantv.com'],
        //receivers: ['guozongwei@hefantv.com'],
        subject: '发现error',
        html: '发现error,请迅速排查！'
    }

}