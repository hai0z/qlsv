"use client";
import React from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { enroll, unEnroll } from "@/app/(dashboard)/lib/prisma/term";

interface Props {
    term: ({
        Enrollment: {
            studentId: string;
            termId: string;
        }[];
        instructor: {
            fullname: string;
        } | null;
        subject: {
            id: string;
            name: string;
            departmentId: string | null;
            credit: number;
        };
    } & {
        id: string;
        name: string;
        subjectId: string;
        instructorId: string | null;
        maxStudent: number;
    })[];
}
function ListTerm({ term }: Props) {
    const { data: session } = useSession();

    const enrollment = async (term: any) => {
        const isFull = term.Enrollment.length;

        const isEnrolled = term.Enrollment.find(
            (item: any) => item.studentId === session?.user?.name
        );

        if (isEnrolled) {
            return toast.error("Đã đăng kí học phần tương tự rồi");
        }
        if (isFull === term.maxStudent) {
            return toast.error("Học phần đã đầy");
        }

        toast.promise(enroll(term.id, session?.user?.name as string), {
            loading: "Đang đăng kí",
            success: "Đăng kí thành công",
            error: "Đăng ký thất bại",
        });
    };

    const unEnrollment = async (termId: string) => {
        toast.promise(unEnroll(termId, session?.user?.name as string), {
            loading: "Đang huỷ đăng kí",
            success: "Huỷ kí thành công",
            error: "Huỷ kí thất bại",
        });
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table table-lg mt-8">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã học phần</th>
                            <th>Tên học phần</th>
                            <th>GVHD</th>
                            <th>Số tín chỉ</th>
                            <th>Sĩ số</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {term.map((item, index) => (
                            <tr>
                                <th>{index + 1}</th>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.instructor?.fullname}</td>
                                <td>{item.subject.credit}</td>
                                <td>
                                    {item.Enrollment.length} / {item.maxStudent}
                                </td>
                                <td className="text-primary">Mở lớp</td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={
                                            item.Enrollment.find(
                                                (enrollment) =>
                                                    enrollment.studentId ===
                                                    session?.user?.name
                                            )
                                                ? () => unEnrollment(item.id)
                                                : () => enrollment(item)
                                        }
                                    >
                                        {item.Enrollment.find(
                                            (enrollment) =>
                                                enrollment.studentId ===
                                                session?.user?.name
                                        )
                                            ? "Huỷ"
                                            : "Đăng kí"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListTerm;
