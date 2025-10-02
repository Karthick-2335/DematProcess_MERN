import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { useNavigate } from "react-router";
import Input from "../../components/form/input/InputField";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useEffect, useState } from "react";
import { BoxIcon } from "../../icons";
import Button from "../../components/ui/button/Button";

interface UserInfo {
  applicationNo: string;
  userName: string;
  panNumber: string;
  email: string;
  mobile: string;
  createdon: string;
  status: string;
}
const users: UserInfo[] = [
  {
    applicationNo: "APP001",
    userName: "Alice Johnson",
    panNumber: "ABCDE1234F",
    email: "alice.johnson@example.com",
    mobile: "9876543210",
    createdon: "2025-09-29",
    status: "Pending",
  },
  {
    applicationNo: "APP002",
    userName: "Bob Smith",
    panNumber: "XYZAB5678K",
    email: "bob.smith@example.com",
    mobile: "9123456789",
    createdon: "2025-09-28",
    status: "Approved",
  },
  {
    applicationNo: "APP003",
    userName: "Charlie Brown",
    panNumber: "LMNOP9876Q",
    email: "charlie.brown@example.com",
    mobile: "9988776655",
    createdon: "2025-09-27",
    status: "Rejected",
  },
];
const kycInfo = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo[]>();
  useEffect(() => {
    setUser(users);
  }, []);
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="KYC Information" />
      <div className="space-y-6">
        <ComponentCard title="">
          <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6 mb-4">
            <Button
              onClick={() => navigate("/kyclayout")}
              size="sm"
              variant="primary"
              startIcon={<BoxIcon className="size-5" />}
            >
              NEW KYC
            </Button>
            <Input
              type="text"
              name="search"
              placeholder="Search from the keyword"
              className="w-full sm:w-64"
            />
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Application No.
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      PAN Number
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Mobile
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Created On
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {users.map((user) => (
                    <TableRow key={user.applicationNo}>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.applicationNo}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.userName}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.panNumber}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.mobile}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.createdon}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {user.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
};

export default kycInfo;
