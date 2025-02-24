import type React from "react"
import { useState, useCallback, useMemo, useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { personalSchema, type StudentFormData, studentSchema } from "@/utils/student.validation"
import { selectAcademicClasses } from "@/redux/slices/academicSlice"
import { useAppSelector } from "@/redux/hooks/useAppSelector"
import type { AcademicClasses, Division } from "@/types/academic"
import { useDispatch } from "react-redux"
import { selectAuthState } from '@/redux/slices/authSlice';
import { toast } from "@/hooks/use-toast"
import { useLazyGetAcademicClassesQuery } from "@/services/AcademicService"
import { useAddStudentsMutation, useLazyFetchStudentForClassQuery } from "@/services/StundetServices"
import { z } from "zod"
import { Student, StudentEntry, UpdateStudent } from "@/types/student"

interface StudentFormProps {
  onClose: () => void
  form_type: "create" | "update" | "view"
  initial_data?: Student | null
 
}

const StudentForm: React.FC<StudentFormProps> = ({ onClose, initial_data, form_type }) => {

  const dispatch = useDispatch()
  const AcademicClasses = useAppSelector(selectAcademicClasses)
  const authState = useAppSelector(selectAuthState)
  const isLoading = useAppSelector((state) => state.academic.loading)

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      first_name_in_guj: "",
      middle_name_in_guj: "",
      last_name_in_guj: "",
      gender: "Male", // Default to "Male"
      birth_date: "",
      birth_place: "",
      birth_place_in_guj: "",
      aadhar_no: undefined,
      aadhar_dise_no: undefined,

      father_name: "",
      father_name_in_guj: "",
      mother_name: "",
      mother_name_in_guj: "",
      primary_mobile: undefined,
      secondary_mobile: undefined,

      gr_no: undefined,
      roll_number: undefined,
      admission_date: "",
      admission_std: undefined,
      class: "",
      division: "",
      privious_school: "",
      privious_school_in_guj: "",

      religiion: "",
      religiion_in_guj: "",
      caste: "",
      caste_in_guj: "",
      category: "OPEN", // Default to "OPEN"

      address: "",
      district: "",
      city: "",
      state: "",
      postal_code: "",

      bank_name: "",
      account_no: undefined,
      IFSC_code: "",
    },
  })

  const [
    getAcademicClasses,
    { isLoading: isLoadingForAcademicClasses, isError: isErrorWhileFetchingClass, error: errorWhiwlFetchingClass },
  ] = useLazyGetAcademicClassesQuery()

  const [selectedClass, setSelectedClass] = useState<string>("")
  const [activeTab, setActiveTab] = useState("personal")
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null)

  const availableDivisions = useMemo<AcademicClasses | null>(() => {
    if (AcademicClasses && selectedClass) {
      return AcademicClasses!.filter((cls) => {
        if (cls.class.toString() === selectedClass) {
          return cls
        }
      })[0]
    } else {
      return null
    }
  }, [AcademicClasses, selectedClass])

  const handleClassChange = useCallback(
    (value: string) => {
      setSelectedClass(value)
      setSelectedDivision(null)
      form.setValue("division", "") // Reset division when class changes
    },
    [setSelectedClass, setSelectedDivision, form.setValue],
  )

  const handleDivisionChange = useCallback(
    (value: string) => {
      const selectedDiv = availableDivisions?.divisions.find((div) => div.id.toString() === value)
      setSelectedDivision(selectedDiv || null)
    },
    [availableDivisions, setSelectedDivision],
  )

  const handleSubmit: SubmitHandler<StudentFormData> = (values: z.infer<typeof studentSchema>) => {
    if (form_type === "create") {

    }
    else if (form_type === "update") {

    } else {

    }

  }

  // const handleUpdateStudent = useCallback(
  //   async (studentData: UpdateStudent , student_id : number) => {
  //     try {
  //       // let result = await updateStudent({
  //       //   student_id: student_id,
  //       //   student_data: {
  //       //     first_name: studentData.first_name,
  //       //     middle_name: studentData.middle_name,
  //       //     last_name: studentData.last_name,
  //       //     first_name_in_guj: studentData.first_name_in_guj,
  //       //     middle_name_in_guj: studentData.middle_name_in_guj,
  //       //     last_name_in_guj: studentData.last_name_in_guj,
  //       //     gender: studentData.gender,
  //       //     birth_date: studentData.birth_date,
  //       //     gr_no: studentData.gr_no,
  //       //     primary_mobile: studentData.primary_mobile,
  //       //     father_name: studentData.father_name,
  //       //     father_name_in_guj: studentData.father_name_in_guj,
  //       //     mother_name: studentData.mother_name,
  //       //     mother_name_in_guj: studentData.mother_name_in_guj,
  //       //     roll_number: studentData.roll_number,
  //       //     aadhar_no: studentData.aadhar_no,
  //       //     is_active: true,
  //       //   },
  //       //   student_meta_data: {
  //       //     aadhar_dise_no: studentData.aadhar_dise_no,
  //       //     birth_place: studentData.birth_place,
  //       //     birth_place_in_guj: studentData.birth_place_in_guj,
  //       //     religiion: studentData.religiion,
  //       //     religiion_in_guj: studentData.religiion_in_guj,
  //       //     caste: studentData.caste,
  //       //     caste_in_guj: studentData.caste_in_guj,
  //       //     category: studentData.category,
  //       //     category_in_guj: studentData.category_in_guj,
  //       //     admission_date: studentData.admission_date,
  //       //     admission_class_id: studentData.division,
  //       //     secondary_mobile: studentData.secondary_mobile,
  //       //     privious_school: studentData.privious_school,
  //       //     privious_school_in_guj: studentData.privious_school_in_guj,
  //       //     address: studentData.address,
  //       //     district: studentData.district,
  //       //     city: studentData.city,
  //       //     state: studentData.state,
  //       //     postal_code: studentData.postal_code,
  //       //     bank_name: studentData.bank_name,
  //       //     account_no: studentData.account_no,
  //       //     IFSC_code: studentData.IFSC_code,
  //       //   },
  //       // }).unwrap()
  //       toast({
  //         title: "Success",
  //         description: "Student updated successfully",
  //       })
  //     } catch (error) {

  //     }
  //   },
  //   [updateStudent, getStudentForClass, authState.user],
  // )

  // const handleAddStudent = useCallback(async (studentData: any) => {
  //   try {
  //     let result = await addStudent({
  //       class_id: studentData.division,
  //       students: [
  //         {
  //           students_data: {
  //             school_id: authState.user!.school_id,
  //             class_id: studentData.division,
  //             first_name: studentData.first_name,
  //             middle_name: studentData.middle_name,
  //             last_name: studentData.last_name,
  //             first_name_in_guj: studentData.first_name_in_guj,
  //             middle_name_in_guj: studentData.middle_name_in_guj,
  //             last_name_in_guj: studentData.last_name_in_guj,
  //             gender: studentData.gender,
  //             birth_date: studentData.birth_date,
  //             gr_no: studentData.gr_no,
  //             primary_mobile: studentData.primary_mobile,
  //             father_name: studentData.father_name,
  //             father_name_in_guj: studentData.father_name_in_guj,
  //             mother_name: studentData.mother_name,
  //             mother_name_in_guj: studentData.mother_name_in_guj,
  //             roll_number: studentData.roll_number,
  //             aadhar_no: studentData.aadhar_no,
  //             is_active: true,
  //           },
  //           student_meta_data: {
  //             aadhar_dise_no: studentData.aadhar_dise_no,
  //             birth_place: studentData.birth_place,
  //             birth_place_in_guj: studentData.birth_place_in_guj,
  //             religiion: studentData.religiion,
  //             religiion_in_guj: studentData.religiion_in_guj,
  //             caste: studentData.caste,
  //             caste_in_guj: studentData.caste_in_guj,
  //             category: studentData.category,
  //             category_in_guj: studentData.category_in_guj,
  //             admission_date: studentData.admission_date,
  //             admission_class_id: studentData.division,
  //             secondary_mobile: studentData.secondary_mobile,
  //             privious_school: studentData.privious_school,
  //             privious_school_in_guj: studentData.privious_school_in_guj,
  //             address: studentData.address,
  //             district: studentData.district,
  //             city: studentData.city,
  //             state: studentData.state,
  //             postal_code: studentData.postal_code,
  //             bank_name: studentData.bank_name,
  //             account_no: studentData.account_no,
  //             IFSC_code: studentData.IFSC_code,
  //           },
  //         },
  //       ],
  //     }).unwrap()
  //     toast({
  //       title: "Success",
  //       description: "Student added successfully",
  //     })
  //     setOpenDialogForStudent({
  //       isOpen: false,
  //       selectedStudent: null,
  //       type: "add"
  //     })
  //     getStudentForClass({ class_id: studentData.division })

  //   } catch (error) {
  //     console.error("Error while adding/updating student", error)
  //     toast({
  //       title: "Error",
  //       description: "Failed to add/update student",
  //       variant: "destructive",
  //     })
  //   }
  // }, [addStudent, getStudentForClass, authState.user])


  const handleNextTab = useCallback(async () => {

    let isValidToChangeTab: boolean = false;

    if (activeTab === "personal") {
      isValidToChangeTab = (await personalSchema.safeParseAsync(form.getValues())).success
    }

    if (activeTab === "personal") setActiveTab("family")
    else if (activeTab === "family") setActiveTab("academic")
    else if (activeTab === "academic") setActiveTab("other")
    else if (activeTab === "other") setActiveTab("address")
    else if (activeTab === "address") setActiveTab("bank")
  }, [activeTab, setActiveTab, form.getValues])

  const handlePreviousTab = useCallback(() => {
    if (activeTab === "family") setActiveTab("personal")
    else if (activeTab === "academic") setActiveTab("family")
    else if (activeTab === "other") setActiveTab("academic")
    else if (activeTab === "address") setActiveTab("other")
    else if (activeTab === "bank") setActiveTab("address")
  }, [activeTab])


  useEffect(() => {
    if (!AcademicClasses && authState.user) {
      getAcademicClasses(authState.user!.school_id);
    }
  }, [setSelectedClass, setSelectedDivision])


  useEffect(() => {
    if (form_type === "update") {

    }
  }, [AcademicClasses])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!AcademicClasses || AcademicClasses.length === 0) {
    return <div>No classes available. Please add classes first.</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="bank">Bank</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middle_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name_in_guj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name (Gujarati)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="middle_name_in_guj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name (Gujarati)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name_in_guj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name (Gujarati)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birth_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="birth_place"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Place</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birth_place_in_guj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Place (Gujarati)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="aadhar_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhar Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(+e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aadhar_dise_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aadhar DISE Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(+e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="button" onClick={handleNextTab}>
                  Next
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="family">
            <Card>
              <CardHeader>
                <CardTitle>Family Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="father_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="father_name_in_guj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Name (Gujarati)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mother_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother's Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mother_name_in_guj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother's Name (Gujarati)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="primary_mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Mobile</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            {...field}
                            onChange={(e) => field.onChange(+e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="secondary_mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Mobile</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            {...field}
                            onChange={(e) => field.onChange(+e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousTab}
                >
                  Previous
                </Button>
                <Button type="button" onClick={handleNextTab}>
                  Next
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="academic">
            <Card>
              <CardHeader>
                <CardTitle>Academic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gr_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GR Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(+e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="roll_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roll Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(+e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="admission_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admission Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="admission_std"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admission Standard</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(+e.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleClassChange(value);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger >
                              <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value=" " disabled>
                              Classes
                            </SelectItem>
                            {AcademicClasses.map(
                              (cls, index) =>
                                cls.divisions.length > 0 && (
                                  <SelectItem
                                    key={index}
                                    value={cls.class.toString()}
                                  >
                                    Class {cls.class}
                                  </SelectItem>
                                )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="division"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Division</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleDivisionChange(value);
                          }}
                          disabled={!selectedClass}
                        >
                          <FormControl>
                            <SelectTrigger >
                              <SelectValue placeholder="Select Division" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value=" " disabled>
                              Divisions
                            </SelectItem>
                            {availableDivisions &&
                              availableDivisions.divisions.map(
                                (division, index) => (
                                  <SelectItem
                                    key={index}
                                    value={division.id.toString()}
                                  >
                                    {`${division.division} ${division.aliases
                                      ? "- " + division.aliases
                                      : ""
                                      }`}
                                  </SelectItem>
                                )
                              )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="privious_school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous School</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="privious_school_in_guj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous School (Gujarati)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousTab}
                >
                  Previous
                </Button>
                <Button type="button" onClick={handleNextTab}>
                  Next
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="other">
            <Card>
              <CardHeader>
                <CardTitle>Other Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="religiion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Religion</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="religiion_in_guj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Religion (Gujarati)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="caste"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Caste</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="caste_in_guj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Caste (Gujarati)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ST">ST</SelectItem>
                          <SelectItem value="SC">SC</SelectItem>
                          <SelectItem value="OBC">OBC</SelectItem>
                          <SelectItem value="OPEN">OPEN</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousTab}
                >
                  Previous
                </Button>
                <Button type="button" onClick={handleNextTab}>
                  Next
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="address">
            <Card>
              <CardHeader>
                <CardTitle>Address Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousTab}
                >
                  Previous
                </Button>
                <Button type="button" onClick={handleNextTab}>
                  Next
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="bank">
            <Card>
              <CardHeader>
                <CardTitle>Bank Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="bank_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="account_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="IFSC_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IFSC Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousTab}
                >
                  Previous
                </Button>
                <Button type="submit">
                  {form_type === "create" ? "Submit" : "Update"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}

export default StudentForm

