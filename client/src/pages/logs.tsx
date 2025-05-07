import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  List,
  Calendar,
  Search,
  FileDown,
  Filter,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { formatDate, downloadFile } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ActivityRecord, CryptoOperation } from '@/types';

const Logs = () => {
  const { toast } = useToast();
  
  // State for filters
  const [operationType, setOperationType] = useState<CryptoOperation | 'all'>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch activities from API
  const { data: activities, isLoading, isError } = useQuery<ActivityRecord[]>({
    queryKey: ['/api/activities', operationType, startDate, endDate, searchTerm],
  });

  // Export logs as CSV or JSON
  const exportLogs = (format: 'csv' | 'json') => {
    if (!activities || activities.length === 0) {
      toast({
        title: "Export failed",
        description: "No logs to export",
        variant: "destructive",
      });
      return;
    }

    if (format === 'csv') {
      // Create CSV content
      const headers = "ID,Operation,Algorithm,Input,Result,Timestamp\n";
      const csvContent = headers + activities.map(activity => 
        `${activity.id},"${activity.operation}","${activity.algorithm}","${activity.input}",${activity.result},"${activity.timestamp}"`
      ).join('\n');
      
      downloadFile(csvContent, 'cryptovault_logs.csv', 'text/csv');
      
      toast({
        title: "Logs exported as CSV",
        description: `${activities.length} records exported successfully`,
      });
    } else {
      // Create JSON content
      const jsonContent = JSON.stringify(activities, null, 2);
      downloadFile(jsonContent, 'cryptovault_logs.json', 'application/json');
      
      toast({
        title: "Logs exported as JSON",
        description: `${activities.length} records exported successfully`,
      });
    }
  };

  // Clear all logs
  const clearLogs = () => {
    // This would typically call an API to clear logs
    toast({
      title: "Logs cleared",
      description: "All log entries have been removed",
    });
  };

  // Filter logs based on current filters
  const filteredLogs = activities ? activities.filter(activity => {
    // Filter by operation type
    if (operationType !== 'all' && activity.operation !== operationType) {
      return false;
    }
    
    // Filter by date range
    if (startDate && new Date(activity.timestamp) < startDate) {
      return false;
    }
    
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (new Date(activity.timestamp) > endOfDay) {
        return false;
      }
    }
    
    // Filter by search term
    if (searchTerm && !activity.input.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !activity.algorithm.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }) : [];

  // Pagination
  const totalPages = Math.ceil((filteredLogs?.length || 0) / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get operation label
  const getOperationLabel = (operation: CryptoOperation): string => {
    switch (operation) {
      case 'encrypt': return 'Encryption';
      case 'decrypt': return 'Decryption';
      case 'hash': return 'Hashing';
      case 'generate-key': return 'Key Generation';
      case 'sign': return 'Digital Signature';
      case 'verify': return 'Signature Verification';
      default: return operation;
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Logs & History</h1>
        <div className="mt-3 sm:mt-0 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportLogs('csv')}
            disabled={isLoading || !activities || activities.length === 0}
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            Export CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportLogs('json')}
            disabled={isLoading || !activities || activities.length === 0}
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            Export JSON
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={clearLogs}
            disabled={isLoading || !activities || activities.length === 0}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Logs
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Operation type filter */}
            <div>
              <Label htmlFor="operation-type">Operation Type</Label>
              <Select 
                value={operationType} 
                onValueChange={(value) => {
                  setOperationType(value as CryptoOperation | 'all');
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger id="operation-type">
                  <SelectValue placeholder="All Operations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Operations</SelectItem>
                    <SelectItem value="encrypt">Encryption</SelectItem>
                    <SelectItem value="decrypt">Decryption</SelectItem>
                    <SelectItem value="hash">Hashing</SelectItem>
                    <SelectItem value="generate-key">Key Generation</SelectItem>
                    <SelectItem value="sign">Digital Signature</SelectItem>
                    <SelectItem value="verify">Signature Verification</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Start date filter */}
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? formatDate(startDate) : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date);
                      setCurrentPage(1);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End date filter */}
            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? formatDate(endDate) : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date);
                      setCurrentPage(1);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Search */}
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  id="search"
                  placeholder="Search in logs..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="p-6 text-center">
              <p className="text-red-500">Error loading logs. Please try again.</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-6 text-center">
              <List className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-lg font-medium text-slate-900 dark:text-white">No logs found</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {activities && activities.length > 0 
                  ? "Try adjusting your filters to see more results." 
                  : "You haven't performed any cryptographic operations yet."}
              </p>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">ID</TableHead>
                      <TableHead>Operation</TableHead>
                      <TableHead>Algorithm</TableHead>
                      <TableHead>Input</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLogs.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.id}</TableCell>
                        <TableCell>{getOperationLabel(activity.operation)}</TableCell>
                        <TableCell>{activity.algorithm}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{activity.input}</TableCell>
                        <TableCell>
                          <Badge variant={activity.result ? "success" : "destructive"}>
                            {activity.result ? 'Success' : 'Failed'}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(activity.timestamp)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="py-4 border-t border-slate-200 dark:border-slate-700">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }} 
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <PaginationItem key={pageNum}>
                            <PaginationLink 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(pageNum);
                              }}
                              isActive={currentPage === pageNum}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                      
                      {totalPages > 5 && (
                        <>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(totalPages);
                              }}
                              isActive={currentPage === totalPages}
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Logs;
