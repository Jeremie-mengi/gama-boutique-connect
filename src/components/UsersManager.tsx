import { useRef, useState } from "react";
import { Plus, Users, Shield, Upload, FileText, X, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { ROLES, roleLabel, type AppUser, type Boutique, type Role, type DossierFile } from "@/lib/mockData";

interface Props {
  users: AppUser[];
  setUsers: React.Dispatch<React.SetStateAction<AppUser[]>>;
  boutiques: Boutique[];
}

const UsersManager = ({ users, setUsers, boutiques }: Props) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [toDelete, setToDelete] = useState<AppUser | null>(null);
  const [formRole, setFormRole] = useState<Role>("vendeur");
  const [formBoutique, setFormBoutique] = useState<string>("none");

  const openCreate = () => {
    setEditing(null);
    setFormRole("vendeur");
    setFormBoutique("none");
    setOpen(true);
  };

  const openEdit = (u: AppUser) => {
    setEditing(u);
    setFormRole(u.role);
    setFormBoutique(u.boutique_id ?? "none");
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const full_name = String(fd.get("full_name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    if (!full_name || !email) {
      toast.error("Nom et email requis");
      return;
    }
    const boutique_id = formBoutique === "none" ? null : formBoutique;
    if (editing) {
      setUsers((prev) => prev.map((u) => u.id === editing.id ? { ...u, full_name, email, role: formRole, boutique_id } : u));
      toast.success("Utilisateur modifié");
    } else {
      setUsers((prev) => [{ id: crypto.randomUUID(), full_name, email, role: formRole, boutique_id }, ...prev]);
      toast.success("Utilisateur créé");
    }
    setOpen(false);
  };

  const handleDelete = () => {
    if (!toDelete) return;
    setUsers((prev) => prev.filter((u) => u.id !== toDelete.id));
    toast.success(`${toDelete.full_name} supprimé`);
    setToDelete(null);
  };

  const updateUser = (id: string, patch: Partial<AppUser>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  };

  const boutiqueName = (id: string | null) =>
    boutiques.find((b) => b.id === id)?.nom ?? "—";

  return (
    <Card className="p-6 shadow-card border-border/60">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-xl">Utilisateurs</h2>
            <p className="text-sm text-muted-foreground">
              {users.length} membre{users.length > 1 ? "s" : ""} · liés à une boutique
            </p>
          </div>
        </div>

        <Button variant="hero" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nouvel utilisateur
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nom complet *</Label>
                <Input id="full_name" name="full_name" required defaultValue={editing?.full_name ?? ""} placeholder="Aïcha Diallo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required defaultValue={editing?.email ?? ""} placeholder="aicha@gama.com" />
              </div>
              <div className="space-y-2">
                <Label>Rôle</Label>
                <Select value={formRole} onValueChange={(v) => setFormRole(v as Role)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Boutique</Label>
                <Select value={formBoutique} onValueChange={setFormBoutique}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune</SelectItem>
                    {boutiques.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" variant="hero">{editing ? "Enregistrer" : "Créer"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer cet utilisateur ?</AlertDialogTitle>
              <AlertDialogDescription>
                {toDelete?.full_name} sera retiré définitivement de la liste.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {users.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">Aucun utilisateur.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Boutique</TableHead>
                <TableHead>Dossier de l'agent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === "admin" ? "default" : "secondary"} className="gap-1">
                      {u.role === "admin" && <Shield className="h-3 w-3" />}
                      {roleLabel(u.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={u.boutique_id ?? "none"}
                      onValueChange={(v) =>
                        updateUser(u.id, { boutique_id: v === "none" ? null : v })
                      }
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue>{boutiqueName(u.boutique_id)}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune</SelectItem>
                        {boutiques.map((b) => (
                          <SelectItem key={b.id} value={b.id}>{b.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <DossierCell user={u} onUpdate={(d) => updateUser(u.id, { dossier: d })} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEdit(u)} title="Modifier">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setToDelete(u)} title="Supprimer">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

const DossierCell = ({ user, onUpdate }: { user: AppUser; onUpdate: (d: DossierFile | null) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dossier = user.dossier;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    onUpdate({
      name: f.name,
      size: f.size,
      type: f.type,
      uploadedAt: new Date().toISOString(),
    });
    toast.success(`Dossier de ${user.full_name} uploadé`);
    e.target.value = "";
  };

  const fmtSize = (b: number) => b < 1024 ? `${b} o` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} Ko` : `${(b / 1024 / 1024).toFixed(1)} Mo`;

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
        onChange={handleFile}
      />
      {dossier ? (
        <div className="flex items-center gap-2 rounded-md border border-border/60 bg-card/40 px-2 py-1 max-w-[220px]">
          <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium truncate" title={dossier.name}>{dossier.name}</div>
            <div className="text-[10px] text-muted-foreground">{fmtSize(dossier.size)}</div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { onUpdate(null); toast.success("Dossier retiré"); }}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <Upload className="h-3.5 w-3.5" /> Uploader
        </Button>
      )}
    </div>
  );
};

export default UsersManager;
