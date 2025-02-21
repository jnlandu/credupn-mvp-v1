// utils/reviewers.ts
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

interface ReviewerUserData {
    id: string;
    name: string;
    email: string;
    institution: string;
  }

  interface ReviewerTable {
    id: string;
    user_id: string;
    specialization: string[];
    expertise: string;
    availability: boolean;
    users: ReviewerUserData;
  }

  interface SupabaseReviewerResponse {
    id: string;
    user_id: string;
    specialization: string[];
    expertise: string;
    availability: boolean;
    user: {
      id: string;
      name: string;
      email: string;
      institution: string;
    };
  }

export const fetchReviewers = async (): Promise<ReviewerTable[]> => {
  const supabase = createClient();
  
  try {
    // Verify admin status
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      throw authError;
    }

    if (!user) {
      throw new Error('Not authenticated');
    }

    // Verify admin role
    const { data: adminCheck, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (roleError) {
      console.error('Role check error:', roleError);
      throw roleError;
    }

    if (adminCheck?.role !== 'admin') {
      throw new Error('Not authorized as admin');
    }

    const { data: reviewerData, error: reviewerError } = await supabase
      .from('reviewers')
      .select(`
        id,
        user_id,
        specialization,
        expertise,
        availability,
        user:user_id (
          id,
          name,
          email,
          institution
        )
      `)
      .eq('availability', true);

    if (reviewerError) {
      console.error('Reviewer fetch error:', reviewerError);
      throw reviewerError;
    }

    if (!reviewerData) {
      return [];
    }

    const mappedReviewers: ReviewerTable[] = reviewerData.map((reviewer: any) => {
        return {
          id: reviewer.id,
          user_id: reviewer.user_id,
          specialization: reviewer.specialization || [],
          expertise: reviewer.expertise || '',
          availability: reviewer.availability,
          users: {
            id: reviewer.user?.id || '',
            name: reviewer.user?.name || '',
            email: reviewer.user?.email || '',
            institution: reviewer.user?.institution || ''
          }
        };
      });

    return mappedReviewers;

  } catch (error: any) {
    console.error('Error fetching reviewers:', {
      message: error.message,
      details: error.details,
      hint: error.hint
    });
    throw error;
  }
};