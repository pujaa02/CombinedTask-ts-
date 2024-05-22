import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";
import { check, validationResult } from "express-validator";
import con from "../models/database";

import parser from "body-parser";
import { ResultSetHeader, RowDataPacket } from "mysql2";
route.use(parser.json());
route.use(parser.urlencoded({ extended: false }));
const urlencodedParser = parser.urlencoded({ extended: false });
interface FormData {
    phone: string,
    rel_status: string,
    address1: string,
    address2: string,
    bd: string,
    fname: string;
    lname: string;
    designa: string;
    dob: string;
    email: string;
    number: string;
    zipcode: string;
    add1: string;
    add2: string;
    city: string;
    state: string;
    gender: string;
    relstatus: string;
    lan1: string;
    able1?: boolean;
    lan2: string;
    able2?: boolean;
    lan3: string;
    able3?: boolean;
    tech1: string;
    level1: string;
    tech2: string;
    level2: string;
    tech3: string;
    level3: string;
    tech4: string;
    level4: string;
    name1: string;
    mobileno1: string;
    rel1: string;
    name2: string;
    mobileno2: string;
    rel2: string;
    name3: string;
    mobileno3: string;
    rel3: string;
    preloc: string;
    notice: string;
    exctc: string;
    curctc: string;
    depa: string;
    board_name: string[];
    py: string[];
    percentage: string[];
    companyname: string[];
    designation: string[];
    from: string[];
    to: string[];
    name: string[];
    mobileno: string[];
    rel: string[];
}

route.get("/inu", checkAuth, (req: Request, res: Response) => {
    res.render("forminu/home");
});

route.post(
    "/inu", checkAuth,
    urlencodedParser,
    [
        check("fname", "This username must be 3+ characters long")
            .exists()
            .isLength({ min: 3 }),
        check("lname", "This lastname must be 3+ characters long")
            .exists()
            .isLength({ min: 3 }),
        check("designa", "This designation must be 3+ characters long")
            .exists()
            .isLength({ min: 3 }),
        check("dob", "Enter date-of-birth in yyyy-mm-dd format").isDate(),
        check("email", "Email is not valid").isEmail().normalizeEmail(),
        // check("number", "Please enter a valid Mobile Number").isMobilePhone(),
        check("zipcode", "zipcode length should be 6 characters").isLength({
            min: 6,
            max: 6,
        }),
        check("add1", "address1 length should be 6 to 45 characters").isLength({
            min: 6,
            max: 45,
        }),
        check("add2", "address2 length should be 6 to 45 characters").isLength({
            min: 6,
            max: 45,
        }),
    ],
    async (req: Request, res: Response) => {
        let id: number;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const alert = errors.array();
            res.render("forminu/home", {
                alert,
            });
        }
        let jsondata: FormData = req.body;
        const {
            fname,
            lname,
            designa: designation,
            email,
            number: phone,
            gender,
            relstatus: rel_status,
            add1: address1,
            add2: address2,
            city,
            state,
            zipcode,
            dob: bd,
        } = jsondata;

        let edu: string[] = ["ssc", "hsc", "bachelor", "master"];

        let lan1: Array<string | number> = ["", "", ""];
        let lan2: Array<string | number> = ["", "", ""];
        let lan3: Array<string | number> = ["", "", ""];

        lan1[1] = jsondata.lan1;
        if (jsondata.able1) {
            lan1[2] = jsondata.able1.toString();
        }

        lan2[1] = jsondata.lan2;
        if (jsondata.able2) {
            lan2[2] = jsondata.able2.toString();
        }
        lan3[1] = jsondata.lan3;
        if (jsondata.able3) {
            lan3[2] = jsondata.able3.toString();
        }

        let tech1: Array<string | number> = ["", "", ""];
        let tech2: Array<string | number> = ["", "", ""];
        let tech3: Array<string | number> = ["", "", ""];
        let tech4: Array<string | number> = ["", "", ""];

        tech1[1] = jsondata.tech1;
        tech1[2] = jsondata.level1;

        tech2[1] = jsondata.tech2;
        tech2[2] = jsondata.level2;

        tech3[1] = jsondata.tech3;
        tech3[2] = jsondata.level3;

        tech4[1] = jsondata.tech4;
        tech4[2] = jsondata.level4;

        let ref1: string[] = ["", "", "", ""];
        let ref2: string[] = ["", "", "", ""];
        let ref3: string[] = ["", "", "", ""];

        ref1[1] = jsondata.name1;
        ref1[2] = jsondata.mobileno1;
        ref1[3] = jsondata.rel1;

        ref2[1] = jsondata.name2;
        ref2[2] = jsondata.mobileno2;
        ref2[3] = jsondata.rel2;

        ref3[1] = jsondata.name3;
        ref3[2] = jsondata.mobileno3;
        ref3[3] = jsondata.rel3;

        let pre: Array<string | number> = ["", "", "", "", "", ""];

        pre[1] = jsondata.preloc;
        pre[2] = jsondata.notice;
        pre[3] = jsondata.exctc;
        pre[4] = jsondata.curctc;
        pre[5] = jsondata.depa;
        const values = [
            fname,
            lname,
            designation,
            email,
            phone,
            gender,
            rel_status,
            address1,
            address2,
            city,
            state,
            zipcode,
            bd,
        ];
        let result: number = await con.insert(`INSERT INTO emp_details(fname, lname, designation, email, phone, gender, rel_status, address1, address2, city, state, zipcode, bd) VALUES(?)`, [values]);

        id = result;

        let len = jsondata.board_name;
        for (let i = 0; i < len.length; i++) {
            if (jsondata.board_name[i]) {
                await con.insert(`INSERT INTO edu_detail(emp_id, type_of_result, Name_of_board_or_course, Passing_year, Percentage) VALUES('${id}', '${edu[i]}', '${jsondata.board_name[i]}', '${jsondata.py[i]}', '${jsondata.percentage[i]}')`) as unknown as Array<ResultSetHeader>
            }
        }

        let wklen = jsondata.companyname;
        for (let i = 0; i < wklen.length; i++) {
            if (jsondata.companyname[i]) {
                await con.insert(`INSERT INTO work_experience(emp_id, company_name, designation, from_date, to_date) VALUES('${id}', '${jsondata.companyname[i]}', '${jsondata.designation[i]}', '${jsondata.from[i]}', '${jsondata.to[i]}')`) as unknown as Array<ResultSetHeader>

            }
        }



        if (jsondata.lan1) {
            lan1[0] = id;
            await con.insert(`INSERT INTO language(emp_id, language_know, rws) VALUES(?)`, [lan1]) as unknown as Array<ResultSetHeader>
        }
        if (jsondata.lan2) {
            lan2[0] = id;
            await con.insert(`INSERT INTO language(emp_id, language_know, rws) VALUES(?)`, [lan2]) as unknown as Array<ResultSetHeader>
        }
        if (jsondata.lan3) {
            lan3[0] = id;
            await con.insert(`INSERT INTO language(emp_id, language_know, rws) VALUES(?)`, [lan3]) as unknown as Array<ResultSetHeader>
        }


        tech1[0] = id;
        if (jsondata.tech1) {
            await con.insert(`INSERT INTO know_techno(emp_id, tech_know, level_of_technology) VALUES(?)`, [tech1]) as unknown as Array<ResultSetHeader>
        }
        tech2[0] = id;
        if (jsondata.tech2) {
            await con.insert(`INSERT INTO know_techno(emp_id, tech_know, level_of_technology) VALUES(?)`, [tech2]) as unknown as Array<ResultSetHeader>
        }
        tech3[0] = id;
        if (jsondata.tech3) {
            await con.insert(`INSERT INTO know_techno(emp_id, tech_know, level_of_technology) VALUES(?)`, [tech3]) as unknown as Array<ResultSetHeader>
        }
        tech4[0] = id;
        if (jsondata.tech4) {
            await con.insert(`INSERT INTO know_techno(emp_id, tech_know, level_of_technology) VALUES(?)`, [tech4]) as unknown as Array<ResultSetHeader>
        }

        //section ref
        let reflen = jsondata.name;
        for (let i = 0; i < reflen.length; i++) {
            if (jsondata.name[i]) {
                await con.insert(`INSERT INTO reference_contact(emp_id, name, contact_number, relation) VALUES('${id}', '${jsondata.name[i]}', '${jsondata.mobileno[i]}', '${jsondata.rel[i]}')`) as unknown as Array<ResultSetHeader>;
            }
        }
        //section ended
        pre[0] = id;
        await con.insert(`INSERT INTO preferences(emp_id, prefered_location, notice_period, expected_ctc, current_ctc, department) VALUES(?)`, [pre]) as unknown as Array<ResultSetHeader>;
        res.render("forminu/fetchuser");
    });

route.get("/alluser", checkAuth, (req: Request, res: Response) => {
    res.render("forminu/fetchuser");
});
route.get(
    "/normalupdate/:id",
    checkAuth,
    async (req: Request, res: Response) => {
        const id = req.params.id;

        if (id) {

            try {
                const count = await con.getall(
                    `select count(*) as lt from edu_detail where emp_id = ${id}; `
                );

                if (count[0].lt >= 1) {
                    const result = await con.getall(
                        `select * from emp_details where emp_id = ${id}; `
                    );

                    const result1 = await con.getall(`select * from edu_detail where emp_id = ${id}; `) as Array<RowDataPacket>
                    const result2 = await con.getall(`select * from work_experience where emp_id = ${id}; `) as Array<RowDataPacket>
                    const result3 = await con.getall(`select * from language where emp_id = ${id}; `) as Array<RowDataPacket>
                    const result4 = await con.getall(`select * from know_techno where emp_id = ${id}; `) as Array<RowDataPacket>
                    const result5 = await con.getall(`select * from reference_contact where emp_id = ${id}; `) as Array<RowDataPacket>
                    const result6 = await con.getall(`select * from preferences where emp_id = ${id}; `) as Array<RowDataPacket>

                    const tech = result4.map((item: any) => item.tech_know);
                    const techlevel = result4.map(
                        (item: any) => item.tech_know + item.level_of_technology
                    );
                    const lan = result3.map((item: any) => item.language_know);

                    const arr1 =
                        result3
                            .find((item: any) => item.language_know === "hindi")
                            ?.rws.split(",") || [];
                    const arr2 =
                        result3
                            .find((item: any) => item.language_know === "english")
                            ?.rws.split(",") || [];
                    const arr3 =
                        result3
                            .find((item: any) => item.language_know === "gujarati")
                            ?.rws.split(",") || [];

                    res.render("forminu/update", {
                        id,
                        result,
                        result1,
                        result2,
                        result3,
                        result4,
                        tech,
                        techlevel,
                        lan,
                        arr1,
                        arr2,
                        arr3,
                        result5,
                        result6,
                    });
                }
            } catch (err) {
                console.error(err);
                // Handle error response
            }
        }
    }
);

route.post(
    "/normalupdate/:id",
    urlencodedParser,
    [
        check("fname", "This username must me 3+ characters long")
            .exists()
            .isLength({ min: 3 }),
        check("lname", "This lastname must me 3+ characters long")
            .exists()
            .isLength({ min: 3 }),
        check("designa", "This designation must me 3+ characters long")
            .exists()
            .isLength({ min: 3 }),
        check("dob", "Enter date-of-birth in yyyy-mm-dd formate").isDate(),
        check("email", "Email is not valid").isEmail().normalizeEmail(),
        // check("number", "Please enter valid Mobile Number").isMobilePhone(),
        check("zipcode", "zipcode length should be 6 characters").isLength({
            min: 6,
            max: 6,
        }),
        check("add1", "address1 length should be 6 to 45 characters").isLength({
            min: 6,
            max: 45,
        }),
        check("add2", "address2 length should be 6 to 45 characters").isLength({
            min: 6,
            max: 45,
        }),
    ],
    async (req: Request, res: Response) => {
        let id: number = Number(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const alert = errors.array();
            return res.render("forminu/home", {
                alert,
            });
        }
        let jsondata: FormData = req.body;

        if (req.params.id) {
            // =========section1===============
            const {
                fname,
                lname,
                designation,
                email,
                number,
                gender,
                relstatus,
                address1,
                address2,
                city,
                state,
                zipcode,
                dob,

            } = jsondata;
            let emp_detail = await con.update(
                `UPDATE emp_details
          SET fname = '${fname}', lname = '${lname}', designation = '${designation}', email = '${email}', phone = '${number}', gender = '${gender}',
            rel_status = '${relstatus}', address1 = '${address1}', address2 = '${address2}', city = '${city}',
            state = '${state}', zipcode = '${zipcode}', bd = '${dob}'
          WHERE emp_id = '${id}'; `
            ) as unknown as Array<ResultSetHeader>;

            //==========section2=============
            let edu = ["ssc", "hsc", "bachelor", "master"];
            let len = jsondata.board_name;
            let arr6 = await con.getall(
                `select edu_id as edu_id from edu_detail where emp_id in (${id}); `
            ) as Array<RowDataPacket>;
            for (let i = 0; i < len.length; i++) {
                if (arr6[i]) {
                    let edu_detail = await con.update(`UPDATE edu_detail
          SET Name_of_board_or_course = '${jsondata.board_name[i]}', Passing_year = '${jsondata.py[i]}', Percentage = '${jsondata.percentage[i]}'
          WHERE emp_id = '${id}' and type_of_result = '${edu[i]}' and edu_id = '${arr6[i].edu_id}'; `) as unknown as Array<ResultSetHeader>;
                } else {
                    if (len[i]) {
                        let inser_edu = await con.insert(`insert into edu_detail(emp_id,
                type_of_result,
                Name_of_board_or_course,
                Passing_year,
                Percentage) values('${id}', '${edu[i]}', '${jsondata.board_name[i]}', '${jsondata.py[i]}', '${jsondata.percentage[i]}'); `) as unknown as Array<ResultSetHeader>;
                    }
                }
            }
            //============section3============
            let arr = await con.getall(
                `select id as work_id from emp.work_experience where emp_id in (${id}); `
            ) as Array<RowDataPacket>;;

            let wklen = jsondata.companyname;
            for (let i = 0; i < wklen.length; i++) {
                if (arr[i]) {
                    let work_exp = await con.update(`UPDATE work_experience
              SET company_name = '${jsondata.companyname[i]}', designation = '${jsondata.designation[i]}', from_date = '${jsondata.from[i]}', to_date = '${jsondata.to[i]}'
              WHERE emp_id = '${id}' and id = '${arr[i].work_id}'; `) as unknown as Array<ResultSetHeader>;
                } else {
                    if (wklen[i]) {
                        let work_ins = await con.insert(`insert into work_experience(emp_id,
                    company_name, designation, from_date, to_date) values('${id}', '${jsondata.companyname[i]}', '${jsondata.designation[i]}', '${jsondata.from[i]}', '${jsondata.to[i]}'); `) as unknown as Array<ResultSetHeader>;
                    }
                }
            }

            //language

            let languagearr = [];
            let rwsarr = [];
            if (jsondata.lan1) {
                languagearr.push(jsondata.lan1);
                rwsarr.push(jsondata.able1);
            }
            if (jsondata.lan2) {
                languagearr.push(jsondata.lan2);
                rwsarr.push(jsondata.able2);
            }
            if (jsondata.lan3) {
                languagearr.push(jsondata.lan3);
                rwsarr.push(jsondata.able3);
            }
            let del = await con.delete(`delete from language where emp_id = '${id}'; `) as unknown as Array<ResultSetHeader>;
            for (let i = 0; i < languagearr.length; i++) {
                let lan_edit = await con.insert(`insert into language(emp_id,
                        language_know,
                        rws) values('${id}', '${languagearr[i]}', '${rwsarr[i]}')`) as unknown as Array<ResultSetHeader>;
            }

            let tech = [];
            let level = [];
            if (jsondata.tech1) {
                tech.push(jsondata.tech1);
                level.push(jsondata.level1);
            }
            if (jsondata.tech2) {
                tech.push(jsondata.tech2);
                level.push(jsondata.level2);
            }
            if (jsondata.tech3) {
                tech.push(jsondata.tech3);
                level.push(jsondata.level3);
            }
            if (jsondata.tech4) {
                tech.push(jsondata.tech4);
                level.push(jsondata.level4);
            }
            let arr5 = await con.getall(
                `select id as tech_id from emp.know_techno where emp_id in (${id}); `
            ) as Array<RowDataPacket>;;

            for (let i = 0; i < tech.length; i++) {
                if (arr5[i]) {
                    let tech_edit = await con.update(`UPDATE know_techno set
tech_know = '${tech[i]}',
    level_of_technology = '${level[i]}'
                    where emp_id = '${id}' and id = '${arr5[i].tech_id}'; `) as unknown as Array<ResultSetHeader>;
                } else {
                    if (tech[i]) {
                        let insert_tech = await con.insert(
                            `insert into know_techno(emp_id, tech_know, level_of_technology) values('${id}', '${tech[i]}', '${level[i]}')`
                        ) as unknown as Array<ResultSetHeader>;;
                    }
                }
            }
            //section ref
            let arr2 = await con.getall(
                `select ref_id as ref_id from reference_contact where emp_id in (${id}); `
            ) as Array<RowDataPacket>;;
            let reflen = jsondata.name;
            for (let i = 0; i < reflen.length; i++) {
                if (arr2[i]) {
                    let work_exep = await con.update(`UPDATE reference_contact
            SET name = '${jsondata.name[i]}', contact_number = '${jsondata.mobileno[i]}', relation = '${jsondata.rel[i]}'
            WHERE emp_id = '${id}' and ref_id = '${arr2[i].ref_id}'; `) as unknown as Array<ResultSetHeader>;;
                } else {
                    if (reflen[i]) {
                        let ins_workexp =
                            await con.insert(`insert into reference_contact(emp_id, name,
        contact_number, relation) values('${id}', '${jsondata.name[i]}', '${jsondata.mobileno[i]}', '${jsondata.rel[i]}'); `) as unknown as Array<ResultSetHeader>;;;
                    }
                }
            }

            //section ended
            let pref = await con.update(
                `UPDATE preferences
        SET prefered_location = '${jsondata.preloc}', notice_period = '${jsondata.notice}', expected_ctc = '${jsondata.exctc}', current_ctc = '${jsondata.curctc}', department = '${jsondata.depa}'
        WHERE emp_id = '${id}'; `
            ) as unknown as Array<ResultSetHeader>;;;
            //end
        }
        res.send(`data is succesfully updated`);
    }
);

export default route;
