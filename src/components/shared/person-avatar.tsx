import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, initials, profileImageUrl } from "@/lib/utils";

type Props = {
  profileId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  className?: string;
};

export function PersonAvatar({ profileId, firstName, lastName, className }: Props) {
  return (
    <Avatar className={cn("size-10 ring-2 ring-background", className)}>
      {profileId && <AvatarImage src={profileImageUrl(profileId)} alt="" className="object-cover" />}
      <AvatarFallback className="bg-accent font-medium text-primary">
        {initials({ firstName, lastName })}
      </AvatarFallback>
    </Avatar>
  );
}

export function PersonCell({
  profileId,
  firstName,
  lastName,
  title,
  subtitle,
}: Props & { title: string; subtitle?: string | null }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <PersonAvatar profileId={profileId} firstName={firstName} lastName={lastName} />
      <div className="min-w-0">
        <p className="truncate font-medium">{title}</p>
        {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}
