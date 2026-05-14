import { useEffect, useRef, useState } from "react";
import { Plus, Users, Shield, Upload, FileText, X, Pencil, Trash2, Loader2 } from "lucide-react";
import { fetchAllUsers, updateUserApi, deleteUserApi } from "@/lib/usersApi";
// (DossierCell upload retiré : l'upload se fait à la création.)
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
import { ROLES, SEXES, roleLabel, sexeLabel, type AppUser, type Boutique, type Role, type Sexe, type DossierFile } from "@/lib/mockData";

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
  const [formSexe, setFormSexe] = useState<Sexe>("M");
  const [formDossier, setFormDossier] = useState<DossierFile | null>(null);
  const dossierInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchAllUsers()
      .then((list) => { if (mounted) setUsers(list); })
      .catch((e) => toast.error(e?.response?.data?.message || "Impossible de charger les utilisateurs"))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormRole("vendeur");
    setFormBoutique("none");
    setFormSexe("M");
    setFormDossier(null);
    setOpen(true);
  };

  const openEdit = (u: AppUser) => {
    setEditing(u);
    setFormRole(u.role);
    setFormBoutique(u.boutique_id ?? "none");
    setFormSexe(u.sexe ?? "M");
    setFormDossier(u.dossier ?? null);
    setOpen(true);
  };

  const onPickDossier = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFormDossier({ name: f.name, size: f.size, type: f.type, uploadedAt: new Date().toISOString() });
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const full_name = String(fd.get("full_name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const telephone = String(fd.get("telephone") ?? "").trim() || null;
    if (!full_name || !email) {
      toast.error("Nom et email requis");
      return;
    }
    const boutique_id = formBoutique === "none" ? null : formBoutique;
    if (editing) {
      setSubmitting(true);
      try {
        const updated = await updateUserApi(editing.id, {
          nom: full_name, email, telephone, sexe: formSexe, role: formRole,
        });
        setUsers((prev) => prev.map((u) => u.id === editing.id
          ? { ...u, ...updated, boutique_id, dossier: formDossier }
          : u));
        toast.success("Utilisateur modifié");
        setOpen(false);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Échec de la modification");
      } finally {
        setSubmitting(false);
      }
    } else {
      setUsers((prev) => [{ id: crypto.randomUUID(), full_name, email, telephone, sexe: formSexe, role: formRole, boutique_id, dossier: formDossier }, ...prev]);
      toast.success("Utilisateur créé (local)");
      setOpen(false);
    }
  };

  const fmtSize = (b: number) => b < 1024 ? `${b} o` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} Ko` : `${(b / 1024 / 1024).toFixed(1)} Mo`;

  const handleDelete = async () => {
    if (!toDelete) return;
    const target = toDelete;
    setToDelete(null);
    try {
      await deleteUserApi(target.id);
      setUsers((prev) => prev.filter((u) => u.id !== target.id));
      toast.success(`${target.full_name} supprimé`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Échec de la suppression");
    }
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
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" name="telephone" type="tel" defaultValue={editing?.telephone ?? ""} placeholder="+225 07 00 00 00" />
                </div>
                <div className="space-y-2">
                  <Label>Sexe</Label>
                  <Select value={formSexe} onValueChange={(v) => setFormSexe(v as Sexe)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SEXES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
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
              <div className="space-y-2">
                <Label>Dossier de l'agent</Label>
                <input ref={dossierInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip" onChange={onPickDossier} />
                {formDossier ? (
                  <div className="flex items-center gap-2 rounded-md border border-border/60 bg-card/40 px-2 py-2">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium truncate" title={formDossier.name}>{formDossier.name}</div>
                      <div className="text-[10px] text-muted-foreground">{fmtSize(formDossier.size)}</div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => setFormDossier(null)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button type="button" variant="outline" size="sm" onClick={() => dossierInputRef.current?.click()}>
                    <Upload className="h-3.5 w-3.5" /> Uploader un fichier
                  </Button>
                )}
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
                <TableHead>Téléphone</TableHead>
                <TableHead>Sexe</TableHead>
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
                  <TableCell className="text-muted-foreground">{u.telephone ?? "—"}</TableCell>
                  <TableCell>{sexeLabel(u.sexe)}</TableCell>
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
                    {u.dossier ? (
                      <div className="flex items-center gap-2 rounded-md border border-border/60 bg-card/40 px-2 py-1 max-w-[220px]">
                        <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium truncate" title={u.dossier.name}>{u.dossier.name}</div>
                          <div className="text-[10px] text-muted-foreground">{fmtSize(u.dossier.size)}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Aucun dossier</span>
                    )}
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

export default UsersManager;
