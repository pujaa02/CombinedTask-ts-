import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";
import con from "../models/database";
import { RowDataPacket } from "mysql2";

route.get("/result", checkAuth, async (req: Request, res: Response) => {

    const result1 = await con.getall(`select student_master26.id, student_master26.firstname,sum(exam_result.theory_obtain_mark) as Theory,sum(exam_result.prac_total_mark) as Practical from student_master26 join exam_result
   on student_master26.id=exam_result.stu_id where exam_result.exam_id=1 group by student_master26.id;`) as Array<RowDataPacket>;
    const result2 = await con.getall(`select sum(exam_result.theory_obtain_mark) as Th2,sum(exam_result.prac_total_mark) as Prac2 from student_master26 join exam_result
   on student_master26.id=exam_result.stu_id where exam_result.exam_id=2 group by student_master26.id`) as Array<RowDataPacket>;
    const result3 = await con.getall(`select sum(exam_result.theory_obtain_mark) as Th3,sum(exam_result.prac_total_mark) as Prac3 from student_master26 join exam_result
   on student_master26.id=exam_result.stu_id where exam_result.exam_id=3 group by student_master26.id;`) as Array<RowDataPacket>;
    const result4 = await con.getall(`select student_master26.id,sum(exam_result.total_mark) as Alltotal from student_master26 join exam_result
   on student_master26.id=exam_result.stu_id group by student_master26.id;`) as Array<RowDataPacket>;
    const result5 = await con.getall(`SELECT  count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) as TOTAL_PRESENT,
   round((count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) * 100/90),2 )as Percentage from student_master26
  INNER JOIN att_master26  ON student_master26.id=att_master26.stu_id  GROUP BY student_master26.id ; `) as Array<RowDataPacket>;

    res.render("result/result27", {
        users: result1,
        user2: result2,
        user3: result3,
        user4: result4,
        user5: result5,
    });
});

route.get("/datares/:id", checkAuth, async (req: Request, res: Response) => {
    let id = req.params.id;

    const ans1 = await con.getall(`select student_master26.id, student_master26.firstname,count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) as TOTAL_PRESENT,
  round((count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) * 100/90),2 )as Percentage from student_master26
 INNER JOIN att_master26  ON student_master26.id=att_master26.stu_id where student_master26.id=${id}  GROUP BY student_master26.id ;`) as Array<RowDataPacket>;
    const ans2 = await con.getall(`select sub_id,student_master26.id, student_master26.firstname,exam_result.theory_obtain_mark,exam_result.prac_total_mark from student_master26 join exam_result on student_master26.id=exam_result.stu_id where student_master26.id=${id} and exam_result.exam_id=1 ;`) as Array<RowDataPacket>;
    const ans3 = await con.getall(`select sub_id,student_master26.id, student_master26.firstname,exam_result.theory_obtain_mark,exam_result.prac_total_mark from student_master26 join exam_result on student_master26.id=exam_result.stu_id where student_master26.id=${id} and exam_result.exam_id=2 ;`) as Array<RowDataPacket>;
    const ans4 = await con.getall(`select sub_id,student_master26.id, student_master26.firstname,exam_result.theory_obtain_mark,exam_result.prac_total_mark from student_master26 join exam_result on student_master26.id=exam_result.stu_id where student_master26.id=${id} and exam_result.exam_id=3 ;`) as Array<RowDataPacket>;
    const ans5 = await con.getall(`select sub_id,student_master26.id,sum(exam_result.total_mark) as Alltotal from student_master26 join exam_result
  on student_master26.id=exam_result.stu_id group by student_master26.id,sub_id;` ) as Array<RowDataPacket>;

    const ans6 = await con.getall(`select student_master26.id,sum(exam_result.total_mark) as Alltotal from student_master26 join exam_result
 on student_master26.id=exam_result.stu_id  where student_master26.id=${id};`) as Array<RowDataPacket>;
    const ans7 = await con.getall(`select sub_name from subject_master;`) as Array<RowDataPacket>;

    res.render("result/data27", {
        key1: ans1,
        key2: ans2,
        key3: ans3,
        key4: ans4,
        key5: ans5,
        key6: ans6,
        key7: ans7,
    });
});

export default route;
