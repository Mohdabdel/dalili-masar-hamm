ALTER TABLE public.active_participations
  ADD COLUMN IF NOT EXISTS functional_identity jsonb;

COMMENT ON COLUMN public.active_participations.functional_identity IS
'Validated Functional Participation identity block (FA-04), owned by this row. JSON schema: {schema_version:int, title?:text, life_context:text, functional_intent:text, observable_effect:text, natural_completion:text, standalone_role_meaning?:text, participation_mode:"individual"|"shared", complexity_level?:"simple"|"moderate"|"advanced", complexity_rationale?:text, complexity_dimensions?:{c1_elements,c2_coordination,c3_variability,c4_choice_uncertainty}, validated:boolean, validated_gates:text[]}. Unknown dimensions are omitted, never fabricated. NULL = legacy-compatible row with no persisted identity.';