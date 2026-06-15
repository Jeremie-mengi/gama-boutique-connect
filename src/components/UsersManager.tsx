import { useEffect, useRef, useState } from "react";

import {
  Plus,
  Users,
  Shield,
  Upload,
  FileText,
  X,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";

import { api } from "@/lib/api";
import {
  fetchAllUsers,
  updateUserApi,
  deleteUserApi,
} from "@/lib/usersApi";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "sonner";

interface Boutique {
  id: string;
  nom: string;
  emplacement: string;
  userId: string;
}

interface ApiUser {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  sexe: string;
  role: string;
  dossier: any;

  createdAt: string;
  updatedAt: string;

  boutique: Boutique[];
}

interface Props {}

const ROLES = [
  {
    value: "ADMIN",
    label: "Administrateur",
  },

  {
    value: "VENDEUR",
    label: "Vendeur",
  },
];

const SEXES = [
  {
    value: "Masculin",
    label: "Masculin",
  },

  {
    value: "Feminin",
    label: "Féminin",
  },
];

const UsersManager = ({}: Props) => {
  const [users, setUsers] = useState<ApiUser[]>([]);

  const [boutiques, setBoutiques] = useState<Boutique[]>([]);

  const [loading, setLoading] = useState(false);

  const [loadingBoutiques, setLoadingBoutiques] =
    useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [open, setOpen] = useState(false);

  const [editing, setEditing] =
    useState<ApiUser | null>(null);

  const [toDelete, setToDelete] =
    useState<ApiUser | null>(null);

  const [formRole, setFormRole] =
    useState("VENDEUR");

  const [formBoutique, setFormBoutique] =
    useState<string>("none");

  const [formSexe, setFormSexe] =
    useState("Masculin");

  const [formDossier, setFormDossier] =
    useState<File | null>(null);

  const dossierInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUsers();
    fetchBoutiques();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/user/all");

      setUsers(response.data.data || []);
    } catch (error) {
      console.error(error);

      toast.error(
        "Erreur lors du chargement des utilisateurs"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchBoutiques = async () => {
    try {
      setLoadingBoutiques(true);

      const response = await api.get("/boutiques/all");

      setBoutiques(
        response.data.data || response.data || []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "Erreur lors du chargement des boutiques"
      );
    } finally {
      setLoadingBoutiques(false);
    }
  };

  const openCreate = () => {
    setEditing(null);

    setFormRole("VENDEUR");

    setFormBoutique("none");

    setFormSexe("Masculin");

    setFormDossier(null);

    setOpen(true);
  };

  const openEdit = (u: ApiUser) => {
    setEditing(u);

    setFormRole(u.role);

    setFormBoutique(
      u.boutique?.[0]?.id ?? "none"
    );

    setFormSexe(u.sexe);

    setFormDossier(null);

    setOpen(true);
  };

  const onPickDossier = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormDossier(file);

    e.target.value = "";
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const fd = new FormData(e.currentTarget);

      const nom = String(
        fd.get("nom") ?? ""
      ).trim();

      const email = String(
        fd.get("email") ?? ""
      ).trim();

      const telephone = String(
        fd.get("telephone") ?? ""
      ).trim();

      if (!nom || !email) {
        toast.error("Nom et email requis");
        return;
      }

      const payload = {
        nom,
        email,
        telephone,
        sexe: formSexe as any,
        role: formRole,
        boutiqueId:
          formBoutique === "none"
            ? null
            : formBoutique,
      };

      if (editing) {
        await updateUserApi(editing.id, payload);

        toast.success("Utilisateur modifié");
      } else {
        await api.post("/user/create", payload);

        toast.success("Utilisateur créé");
      }

      setOpen(false);

      fetchUsers();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Une erreur est survenue"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;

    const target = toDelete;

    setToDelete(null);

    try {
      await deleteUserApi(target.id);

      setUsers((prev) =>
        prev.filter((u) => u.id !== target.id)
      );

      toast.success(
        `${target.nom} supprimé`
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Échec de la suppression"
      );
    }
  };

  return (
    <Card className="p-6 shadow-card border-border/60">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h2 className="font-bold text-xl">
              Utilisateurs
            </h2>

            <p className="text-sm text-muted-foreground">
              {loading
                ? "Chargement..."
                : `${users.length} membre${
                    users.length > 1 ? "s" : ""
                  }`}
            </p>
          </div>
        </div>

        <Button
          variant="hero"
          onClick={openCreate}
        >
          <Plus className="h-4 w-4" />
          Nouvel utilisateur
        </Button>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing
                  ? "Modifier l'utilisateur"
                  : "Nouvel utilisateur"}
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="nom">
                  Nom complet *
                </Label>

                <Input
                  id="nom"
                  name="nom"
                  required
                  defaultValue={
                    editing?.nom ?? ""
                  }
                  placeholder="Jeremie Mengi"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email *
                </Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue={
                    editing?.email ?? ""
                  }
                  placeholder="jm@gmail.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="telephone">
                    Téléphone
                  </Label>

                  <Input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    defaultValue={
                      editing?.telephone ?? ""
                    }
                    placeholder="099999999"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sexe</Label>

                  <Select
                    value={formSexe}
                    onValueChange={
                      setFormSexe
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {SEXES.map((s) => (
                        <SelectItem
                          key={s.value}
                          value={s.value}
                        >
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rôle</Label>

                <Select
                  value={formRole}
                  onValueChange={
                    setFormRole
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem
                        key={r.value}
                        value={r.value}
                      >
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Boutique</Label>

                <Select
                  value={formBoutique}
                  onValueChange={
                    setFormBoutique
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="none">
                      Aucune
                    </SelectItem>

                    {loadingBoutiques ? (
                      <SelectItem
                        value="loading"
                        disabled
                      >
                        Chargement...
                      </SelectItem>
                    ) : (
                      boutiques.map((b) => (
                        <SelectItem
                          key={b.id}
                          value={b.id}
                        >
                          {b.nom}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Dossier de l'agent
                </Label>

                <input
                  ref={dossierInputRef}
                  type="file"
                  className="hidden"
                  onChange={onPickDossier}
                />

                {formDossier ? (
                  <div className="flex items-center gap-2 rounded-md border border-border/60 bg-card/40 px-2 py-2">
                    <FileText className="h-4 w-4 text-primary shrink-0" />

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium truncate">
                        {formDossier.name}
                      </div>

                      <div className="text-[10px] text-muted-foreground">
                        {(
                          formDossier.size /
                          1024
                        ).toFixed(1)}{" "}
                        Ko
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() =>
                        setFormDossier(null)
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      dossierInputRef.current?.click()
                    }
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Uploader un fichier
                  </Button>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  variant="hero"
                  disabled={submitting}
                >
                  {submitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {editing
                    ? "Enregistrer"
                    : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={!!toDelete}
          onOpenChange={(o) =>
            !o && setToDelete(null)
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Supprimer cet utilisateur ?
              </AlertDialogTitle>

              <AlertDialogDescription>
                {toDelete?.nom} sera supprimé
                définitivement.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Annuler
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm py-8 text-center">
          Chargement...
        </p>
      ) : users.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">
          Aucun utilisateur.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>

                <TableHead>Email</TableHead>

                <TableHead>
                  Téléphone
                </TableHead>

                <TableHead>Sexe</TableHead>

                <TableHead>Rôle</TableHead>

                <TableHead>
                  Boutique
                </TableHead>

                <TableHead>
                  Dossier
                </TableHead>

                <TableHead className="text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.nom}
                  </TableCell>

                  <TableCell>
                    {u.email}
                  </TableCell>

                  <TableCell>
                    {u.telephone || "—"}
                  </TableCell>

                  <TableCell>
                    {u.sexe}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        u.role === "ADMIN"
                          ? "default"
                          : "secondary"
                      }
                      className="gap-1"
                    >
                      {u.role ===
                        "ADMIN" && (
                        <Shield className="h-3 w-3" />
                      )}

                      {u.role}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {u.boutique?.length > 0
                      ? u.boutique[0].nom
                      : "Aucune"}
                  </TableCell>

                  <TableCell>
                    {u.dossier ? (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />

                        <span>Dossier</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Aucun dossier
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          openEdit(u)
                        }
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() =>
                          setToDelete(u)
                        }
                      >
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