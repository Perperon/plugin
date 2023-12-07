const XLSX = require("xlsx");
const fs = require('fs');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const pool = mysql.createConnection({
    host: '172.21.1.170',
    user: "root",
    port: 3306,
    password: '#7VCg1K_19F#',
    database: 'mrtcloud_jx'
});

async function init() {
    const workbook = XLSX.readFile('data.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    var con = await pool;
    const sql = [];
    for (var item = 0;item<data.length;item++){
            const [row] = await con.query(`select id from  kb_staff  where name='${data[item]['name']}' and serial_no = '${data[item]['serial_no']}' and identify_no = '${data[item]['identify_no']}'`);
            if (row.length==0){
                var uuid = `'${uuidv4()}'`;
                console.log(uuid);
                sql.push(`INSERT INTO kb_staff (id, serial_no, name, gender_id,academic_id,hospital_id,section_id,type_id,identify_type_id,identify_no,status,policy,certificated_flag,external_flag) VALUES (${uuid}, '${data[item]['serial_no']}','${data[item]['name']}', '6d108f07-321d-11e7-a55a-000c29687dd9', '08ff61e3-94d4-11e9-b7dd-0050568ce7de','c77e18b0-1ffa-11e7-b036-00163e0603fa','${data[item]['section_id']}','b602463e-4153-11e7-878c-000c29687dd9','2a6bf7fd-321e-11e7-a55a-000c29687dd9','${data[item]['identify_no']}',0,'5354afec-9399-11e7-9412-00163e065a42',0,0);`);
                sql.push(`INSERT INTO kb_teachers (id, hospital_id, teacher_id, section_id,start_date,end_date,type_id,group_leader,master_tutor,practice_tutor,fresh_tutor,status,stdtrain_tutor) VALUES (${uuid}, 'c77e18b0-1ffa-11e7-b036-00163e0603fa',${uuid}, '${data[item]['section_id']}', now(),now(),'3a379c8c-4081-11e9-b11a-94c691901e8d',0,0,1,0,2,0);`);
            }
    }
    fs.writeFileSync('./sql.sql', sql.join('\n'));
}

init().then(() => {
    console.log('done');
});