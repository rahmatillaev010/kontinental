import { demoApplications, demoMembers, demoRoles } from "@/lib/demo-data";
import { defaultSiteContent, mergeSiteContent } from "@/lib/site-content";
import { createServerSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { Application, MemberWithRole, Role, SiteContent } from "@/lib/types";

export async function getRoles(): Promise<Role[]> {
  if (!isSupabaseConfigured) {
    return demoRoles;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase!
    .from("roles")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return demoRoles;
  }

  return data;
}

export async function getMembers(status: "active" | "archived" = "active"): Promise<MemberWithRole[]> {
  if (!isSupabaseConfigured) {
    return demoMembers.filter((member) => member.status === status);
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase!
    .from("members")
    .select("*, role:roles(*)")
    .eq("status", status)
    .order("joined_at", { ascending: false });

  if (error || !data) {
    return demoMembers.filter((member) => member.status === status);
  }

  return data as MemberWithRole[];
}

export async function getAllPublicMembers(): Promise<MemberWithRole[]> {
  if (!isSupabaseConfigured) {
    return demoMembers;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase!
    .from("members")
    .select("*, role:roles(*)")
    .in("status", ["active", "archived"])
    .order("joined_at", { ascending: false });

  if (error || !data) {
    return demoMembers;
  }

  return data as MemberWithRole[];
}

export async function getMemberById(id: string): Promise<MemberWithRole | null> {
  if (!isSupabaseConfigured) {
    return demoMembers.find((member) => member.id === id) ?? null;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase!
    .from("members")
    .select("*, role:roles(*)")
    .eq("id", id)
    .in("status", ["active", "archived"])
    .single();

  if (error || !data) {
    return demoMembers.find((member) => member.id === id) ?? null;
  }

  return data as MemberWithRole;
}

export async function getPendingApplicationsCount(): Promise<number> {
  if (!isSupabaseConfigured) {
    return demoApplications.filter((application) => application.status === "pending").length;
  }

  const supabase = createServerSupabaseClient();
  const { count, error } = await supabase!
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  if (error || count === null) {
    return 0;
  }

  return count;
}

export async function getDemoApplications(): Promise<Application[]> {
  return demoApplications;
}

export async function getSiteContent(): Promise<SiteContent[]> {
  if (!isSupabaseConfigured) {
    return defaultSiteContent;
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase!
    .from("site_content")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    return defaultSiteContent;
  }

  return mergeSiteContent(data as SiteContent[]);
}
