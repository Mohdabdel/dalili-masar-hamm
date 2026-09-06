import { discoverableFrameworkParticipations } from "@/lib/framework/discovery";
import { getMigrationLineage } from "@/lib/framework/batch02-corpus";
const all = discoverableFrameworkParticipations();
console.log(JSON.stringify(all.map(p=>({id:p.id,title:p.title,provenance:p.provenance,event_id:p.event_id??null,legacy_source_id:getMigrationLineage(p.id)?.legacy_id??null})),null,1));
