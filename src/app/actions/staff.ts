"use server";

import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getStaff(date?: string) {
  try {
    const { data: staffData, error: staffError } = await supabase
      .from("staff")
      .select("*")
      .order("created_at", { ascending: false });

    if (staffError) {
      console.error("Error fetching staff:", staffError);
      return [];
    }

    if (date && staffData) {
      const { data: attendanceData, error: attendanceError } = await supabase
        .from("attendance")
        .select("*")
        .eq("date", date);

      if (attendanceError) {
        console.error("Error fetching attendance:", attendanceError);
      } else {
        // Merge attendance into staff data
        return staffData.map(s => {
          const record = attendanceData.find(a => a.staff_id === s.id);
          return {
            ...s,
            attendance_status: record ? record.status : 'Present'
          };
        });
      }
    }

    return staffData || [];
  } catch (error) {
    console.error("Exception fetching staff:", error);
    return [];
  }
}

export async function addStaff(staffMember: { name: string, role: string, phone: string, salary: number }) {
  try {
    const { error } = await supabaseAdmin
      .from("staff")
      .insert([staffMember]);

    if (error) {
      console.error("Error adding staff:", error.message, error.details);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Exception adding staff:", error);
    return { success: false, error: error.message || "An exception occurred" };
  }
}

export async function deleteStaff(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from("staff")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting staff:", error);
      return { success: false, error: "Failed to delete staff member" };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception deleting staff:", error);
    return { success: false, error: "An exception occurred" };
  }
}

export async function updateStaffAttendance(id: string, status: string, date: string) {
  try {
    const { error } = await supabaseAdmin
      .from("attendance")
      .upsert({ 
        staff_id: id, 
        date: date, 
        status: status 
      }, { 
        onConflict: 'staff_id,date' 
      });

    if (error) {
      console.error("Error updating staff attendance:", error);
      return { success: false, error: "Failed to update attendance" };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception updating staff attendance:", error);
    return { success: false, error: "An exception occurred" };
  }
}

export async function getMonthlyAttendance(month: number, year: number) {
  try {
    // Get date range for the month
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from("attendance")
      .select("staff_id, status")
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) throw error;

    // Aggregate stats by staff_id
    const stats: Record<string, { present: number, absent: number, leave: number }> = {};
    
    data?.forEach(record => {
      if (!stats[record.staff_id]) {
        stats[record.staff_id] = { present: 0, absent: 0, leave: 0 };
      }
      
      if (record.status === 'Present') stats[record.staff_id].present++;
      else if (record.status === 'Absent') stats[record.staff_id].absent++;
      else if (record.status === 'On Leave') stats[record.staff_id].leave++;
    });

    return stats;
  } catch (error) {
    console.error("Exception fetching monthly attendance:", error);
    return {};
  }
}
