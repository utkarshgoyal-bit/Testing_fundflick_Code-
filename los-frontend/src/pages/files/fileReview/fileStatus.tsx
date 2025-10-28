/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import hasPermission from '@/helpers/hasPermission';
import { PERMISSIONS } from '@/helpers/permissions';
import { FILE_STATUS, ROLES_ENUM } from '@/lib/enums';
import { cn } from '@/lib/utils';
import { SUBMIT_CUSTOMER__COMMENTS } from '@/redux/actions/types';
import { setPendencyDialogOpen } from '@/redux/slices/pendency';
import { RootState } from '@/redux/store';
import { AlertCircle, Check, MessageSquare, X } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFileStatusColor, getFileStatusIcon } from '../fileHelpers';
import SalesManReviewForm from './salesManReviewForm';

type Comment = {
  type: 'admin' | 'salesman';
  text: string;
  replies: string[];
};

export default function FileStatus({ file }: { file: any }) {
  const { data } = useSelector((state: RootState) => state.login);

  const dispatch = useDispatch();
  const [comments, setComments] = useState<Comment[]>(file.fileCommentsAndReplays || []); // State for comments
  const [remark, setRemark] = useState<string>(''); // State for admin remark
  const [replies, setReplies] = useState<{ [key: number]: string }>({}); // Track replies per comment index

  const handleSubmitRemark = () => {
    if (remark) {
      setComments([...comments, { type: 'admin', text: remark, replies: [] }]);
      setRemark('');
      dispatch({
        type: SUBMIT_CUSTOMER__COMMENTS,
        payload: {
          loanApplicationNumber: file.loanApplicationNumber,
          comments: [...comments, { type: 'admin', text: remark, replies: [] }],
        },
      });
    }
  };

  const handleSubmitReply = (index: number) => {
    if (replies[index]) {
      const updatedComments = [...comments];

      const updatedComment = {
        ...updatedComments[index],
        replies: [...updatedComments[index].replies, replies[index]],
      };

      updatedComments[index] = updatedComment;

      setComments(updatedComments);

      dispatch({
        type: SUBMIT_CUSTOMER__COMMENTS,
        payload: {
          loanApplicationNumber: file.loanApplicationNumber,
          comments: updatedComments,
        },
      });

      setReplies({ ...replies, [index]: '' });
    }
  };

  return (
    <div className="w-full max-h-[70vh] overflow-auto  space-y-8 md:p-6">
      {/* File Status Form */}
      <Card className="p-6">
        <div className="flex   justify-between items-center">
          <h2 className="text-lg font-semibold">File Status : </h2>
          <div
            className={`px-3 float-right py-1 rounded-full text-xs font-medium border ${getFileStatusColor(file.status)}`}
          >
            <div className="flex items-center gap-1">
              {getFileStatusIcon(file.status)}
              <span>{file.status}</span>
            </div>
          </div>
        </div>
        {[FILE_STATUS.APPROVED, FILE_STATUS.REJECTED].includes(file?.status) && (
          <div className="w-full  border-2 p-3 my-3 rounded-md">
            <p className="text-md font-bold">
              {file?.status} by : {file?.approvedOrRejectedBy.firstName ?? ''}{' '}
              {file?.approvedOrRejectedBy.lastName ?? ''}
            </p>
            <p className="text-md font-bold">File Submission Remark:</p>
            <p className="text-sm">{file?.approveOrRejectRemarks || 'N/A'}</p>
          </div>
        )}
        {[FILE_STATUS.APPROVED].includes(file?.status) && (
          <div
            className={cn(
              'w-full  border-2 p-3 my-3 rounded-md',
              file?.loanApplicationFilePayment?.amount
                ? 'bg-green-100 shadow-lg shadow-green-100 text-green-600 border border-green-400'
                : 'bg-red-100 shadow-lg shadow-red-100 text-red-600 border border-red-400'
            )}
          >
            <p className="text-md font-bold">File Payment received:</p>
            <p className="text-sm">Received Amount : {file?.loanApplicationFilePayment?.amount || 'N/A'}</p>
            {file?.loanApplicationFilePayment?.amount && (
              <>
                <p className="text-sm">
                  {' '}
                  Payment Date :{' '}
                  {file?.loanApplicationFilePayment?.paymentDate
                    ? moment(file.loanApplicationFilePayment.paymentDate).format('YYYY-MM-DD')
                    : 'N/A'}
                </p>
                <p className="text-sm"> Payment Mode : {file?.loanApplicationFilePayment?.paymentMethod || 'N/A'}</p>
                <p className="text-sm"> Payment Remarks : {file?.loanApplicationFilePayment?.remarks || 'N/A'}</p>
              </>
            )}
          </div>
        )}
        {hasPermission(PERMISSIONS.CUSTOMER_FILE_TASK_PENDING) &&
          ![FILE_STATUS.APPROVED, FILE_STATUS.REJECTED].includes(file?.status) && (
            <div className="flex md:items-center flex-grow flex-wrap gap-3 mt-4">
              <Button
                disabled={file?.status === 'Task Pending'}
                onClick={() => dispatch(setPendencyDialogOpen({ key: file.loanApplicationNumber, value: true }))}
                className="bg-yellow-400 w-full md:w-auto"
                variant="default"
              >
                <AlertCircle />
                Task Pending
              </Button>

              {hasPermission(PERMISSIONS.CUSTOMER_FILE_TASK_APPROVED) &&
                ![FILE_STATUS.APPROVED, FILE_STATUS.REJECTED].includes(file?.status) && (
                  <Dialog>
                    <DialogTrigger>
                      <span
                        className={cn(
                          buttonVariants({ variant: 'default' }),
                          ' bg-green-400  w-full md:w-auto hover:bg-green-500'
                        )}
                      >
                        <Check className="mr-2 " />
                        Approve
                      </span>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure ?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently approve FI:{' '}
                          {String(file.loanApplicationNumber).padStart(4, '0')}
                        </DialogDescription>
                        <div className="w-full flex justify-center py-7">
                          <SalesManReviewForm
                            loanApplicationNumber={file.loanApplicationNumber}
                            status={FILE_STATUS.APPROVED}
                            loanAmount={file.loanAmount}
                          />
                        </div>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                )}
              {hasPermission(PERMISSIONS.CUSTOMER_FILE_TASK_REJECTED) &&
                ![FILE_STATUS.APPROVED, FILE_STATUS.REJECTED].includes(file?.status) && (
                  <Dialog>
                    <DialogTrigger>
                      <span
                        className={cn(buttonVariants({ variant: 'destructive' }), ' bg-red-400   w-full md:w-auto')}
                      >
                        <X className="mr-2 " />
                        Reject
                      </span>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure ?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently reject FI:{' '}
                          {String(file.loanApplicationNumber).padStart(4, '0')}
                        </DialogDescription>
                        <div className="w-full flex justify-center py-7">
                          <SalesManReviewForm
                            loanApplicationNumber={file.loanApplicationNumber}
                            status={FILE_STATUS.REJECTED}
                            loanAmount={file.loanAmount}
                          />
                        </div>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                )}
            </div>
          )}

        {hasPermission(PERMISSIONS.CUSTOMER_FILE_SEND_REVIEW) && ['Task Pending', 'Pending'].includes(file.status) && (
          <div>
            <Dialog>
              <DialogTrigger className="my-2 bg-secondary px-3 py-1 rounded-md h-9 text-white">
                Send for Review
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Marketing Manager View</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <SalesManReviewForm loanApplicationNumber={file.loanApplicationNumber} loanAmount={file.loanAmount} />
              </DialogContent>
            </Dialog>
          </div>
        )}
        <br />
        <Tabs defaultValue="SalesMan" className="w-full">
          <TabsList className="w-full justify-between">
            <TabsTrigger className="w-1/2" value="SalesMan">
              Sales man report
            </TabsTrigger>
            <TabsTrigger className="w-1/2" value="final">
              Final Approve Report
            </TabsTrigger>
          </TabsList>
          <TabsContent value="SalesMan">
            {file.salesManReport && file.status !== 'Pending' && file.salesManReport.principalAmount > 0 && (
              <Table className="my-4">
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={2} className="text-center  bg-primary text-white">
                      Sales Man Report
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Principal Amount</TableCell>
                    <TableCell>{file.salesManReport?.principalAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">EMI</TableCell>
                    <TableCell>{file.salesManReport?.emi?.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Interest Rate</TableCell>
                    <TableCell>{file.salesManReport?.interestRate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Loan Tenure (in months)</TableCell>
                    <TableCell>
                      {file.salesManReport?.tenureType === 'months'
                        ? file.salesManReport?.loanTenure
                        : file.salesManReport?.loanTenure * 12}{' '}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </TabsContent>
          <TabsContent value="final">
            {file.finalApproveReport && file.status !== 'Pending' && file.finalApproveReport.principalAmount > 0 && (
              <Table className="my-4">
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={2} className="text-center  bg-primary text-white">
                      Final Approve Report
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Principal Amount</TableCell>
                    <TableCell>{file.finalApproveReport?.principalAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">EMI</TableCell>
                    <TableCell>{file.finalApproveReport?.emi?.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Interest Rate</TableCell>
                    <TableCell>{file.finalApproveReport?.interestRate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Loan Tenure (in months)</TableCell>
                    <TableCell>
                      {file.finalApproveReport?.tenureType === 'months'
                        ? file.finalApproveReport?.loanTenure
                        : file.finalApproveReport?.loanTenure * 12}{' '}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Comments Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Comment and replies</h2>
        {data?.role !== ROLES_ENUM.SALES_MAN && (
          <div className="space-y-4">
            {/* Admin's Remark */}
            <Textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Add a comment"
              rows={3}
              className="w-full"
            />
            {hasPermission(PERMISSIONS.CUSTOMER_FILE_COMMENT) && (
              <Button onClick={handleSubmitRemark} variant="secondary" className="w-full mt-2">
                <MessageSquare className="mr-2" />
                Add Comment
              </Button>
            )}
          </div>
        )}

        <div className="mt-8 space-y-6">
          {comments.length === 0 ? (
            <p className="text-center text-gray-500">No comment added yet</p>
          ) : (
            comments.map((comment, index) => (
              <div key={index} className="flex flex-col space-y-4">
                {/* Admin's Comment */}
                {comment.type === 'admin' && (
                  <div className="flex flex-col items-start space-y-2">
                    <div className="max-w-2xl bg-gray-100 text-sm text-gray-800 p-4 rounded-lg shadow-md">
                      <p>{comment.text}</p>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies.map((reply, replyIndex) => (
                  <div key={replyIndex} className="flex flex-col items-end space-y-2">
                    <div className="max-w-2xl bg-blue-100 text-sm text-blue-800 p-4 rounded-lg shadow-md">
                      <p>{reply}</p>
                    </div>
                  </div>
                ))}

                {/* Reply Input */}
                {data?.role === ROLES_ENUM.SALES_MAN && (
                  <div className="mt-2 flex space-x-2">
                    <Input
                      value={replies[index] || ''}
                      onChange={(e) => setReplies({ ...replies, [index]: e.target.value })}
                      placeholder="Salesman reply..."
                      className="w-full rounded-md p-2 border h-9"
                    />
                    <Button onClick={() => handleSubmitReply(index)} variant="outline" className="w-24 self-start h-9">
                      Reply
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
