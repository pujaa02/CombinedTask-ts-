import * as express from "express";
let route = express.Router();
import { Request, Response } from "express";
import checkAuth from "../middlewares/checkauth";
import con from "../models/database";

route.get("/result", checkAuth, (req: Request, res: Response) => {
  let q1 = `select student_master26.id, student_master26.firstname,sum(exam_result.theory_obtain_mark) as Theory,sum(exam_result.prac_total_mark) as Practical from student_master26 join exam_result
    on student_master26.id=exam_result.stu_id where exam_result.exam_id=1 group by student_master26.id;`;
  let q2 = `select sum(exam_result.theory_obtain_mark) as Th2,sum(exam_result.prac_total_mark) as Prac2 from student_master26 join exam_result
    on student_master26.id=exam_result.stu_id where exam_result.exam_id=2 group by student_master26.id`;
  let q3 = `select sum(exam_result.theory_obtain_mark) as Th3,sum(exam_result.prac_total_mark) as Prac3 from student_master26 join exam_result
    on student_master26.id=exam_result.stu_id where exam_result.exam_id=3 group by student_master26.id;`;
  let q4 = ` select student_master26.id,sum(exam_result.total_mark) as Alltotal from student_master26 join exam_result
    on student_master26.id=exam_result.stu_id group by student_master26.id;`;
  let q5 = `  SELECT  count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) as TOTAL_PRESENT,
    round((count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) * 100/90),2 )as Percentage from student_master26
   INNER JOIN att_master26  ON student_master26.id=att_master26.stu_id  GROUP BY student_master26.id ; `;

  con.query(q1, (err, result1) => {
    if (err) throw err;

    con.query(q2, (err, result2) => {
      if (err) throw err;

      con.query(q3, (err, result3) => {
        if (err) throw err;

        con.query(q4, (err, result4) => {
          if (err) throw err;

          con.query(q5, (err, result5) => {
            if (err) throw err;

            res.render("result/result27", {
              users: result1,
              user2: result2,
              user3: result3,
              user4: result4,
              user5: result5,
            });
          });
        });
      });
    });
  });
});

route.get("/datares/:id", checkAuth, (req: Request, res: Response) => {
  let id = req.params.id;
  let q1 = `select student_master26.id, student_master26.firstname,count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) as TOTAL_PRESENT,
    round((count( IF( att_master26.attendance = 'present' , att_master26.date, NULL)) * 100/90),2 )as Percentage from student_master26
   INNER JOIN att_master26  ON student_master26.id=att_master26.stu_id where student_master26.id=${id}  GROUP BY student_master26.id ;`;
  let q2 = `select sub_id,student_master26.id, student_master26.firstname,exam_result.theory_obtain_mark,exam_result.prac_total_mark from student_master26 join exam_result on student_master26.id=exam_result.stu_id where student_master26.id=${id} and exam_result.exam_id=1 ;`;
  let q3 = `select sub_id,student_master26.id, student_master26.firstname,exam_result.theory_obtain_mark,exam_result.prac_total_mark from student_master26 join exam_result on student_master26.id=exam_result.stu_id where student_master26.id=${id} and exam_result.exam_id=2 ;`;
  let q4 = `select sub_id,student_master26.id, student_master26.firstname,exam_result.theory_obtain_mark,exam_result.prac_total_mark from student_master26 join exam_result on student_master26.id=exam_result.stu_id where student_master26.id=${id} and exam_result.exam_id=3 ;`;
  let q5 = `select sub_id,student_master26.id,sum(exam_result.total_mark) as Alltotal from student_master26 join exam_result
    on student_master26.id=exam_result.stu_id group by student_master26.id,sub_id;`;
  let q6 = `  select student_master26.id,sum(exam_result.total_mark) as Alltotal from student_master26 join exam_result
    on student_master26.id=exam_result.stu_id  where student_master26.id=${id};`;
  let q7 = `select sub_name from subject_master;`;

  con.query(q1, (err, ans1) => {
    if (err) throw err;

    con.query(q2, (err, ans2) => {
      if (err) throw err;

      con.query(q3, (err, ans3) => {
        if (err) throw err;

        con.query(q4, (err, ans4) => {
          if (err) throw err;

          con.query(q5, (err, ans5) => {
            if (err) throw err;

            con.query(q6, (err, ans6) => {
              if (err) throw err;

              con.query(q7, (err, ans7) => {
                if (err) throw err;

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
            });
          });
        });
      });
    });
  });
});

export default route;
