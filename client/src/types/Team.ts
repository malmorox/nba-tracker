export interface Team {
    id: number;
    full_name: string;
    abbreviation: string;
    nickname: string;
    city: string;
    state: string;
    year_founded: number;
    arena: string | null;
    head_coach: string | null;
    general_manager: string | null;
}
