import User from "../models/User.js";
import Contract from "../models/Contract.js";

export const DEFAULT_CONTRACT_NUMBER =
    "1234";

const SUPER_ADMIN_USERS = [
    "admin@simpress.com.br",
    "admin.dev@simpress.com.br"
];

export function normalizeUsername(username) {

    return String(username || "")
        .trim()
        .toLowerCase();

}

export function getContractNumber(req) {

    return String(
        req.query?.contractNumber ||
        req.body?.contractNumber ||
        DEFAULT_CONTRACT_NUMBER
    ).trim();

}

function getLoggedUsername(req) {

    return normalizeUsername(
        req.body?.loggedUsername ||
        req.query?.loggedUsername
    );

}

export function isSuperAdmin(user) {

    if (!user) {
        return false;
    }

    return SUPER_ADMIN_USERS.includes(
        normalizeUsername(user.username)
    );

}

export function isGestor(user) {

    if (!user) {
        return false;
    }

    return user.role === "gestor";

}

export function canCreateContracts(user) {

    return (
        isSuperAdmin(user) ||
        isGestor(user)
    );

}

export function canManageUsers(user) {

    return (
        isSuperAdmin(user) ||
        isGestor(user)
    );

}

export async function getVisibleContractNumbers(user) {

    if (!user) {
        return [];
    }

    if (isSuperAdmin(user)) {

        const contracts =
            await Contract.find({})
                .select("number");

        return contracts.map(contract =>
            contract.number
        );

    }

    if (isGestor(user)) {

        const contracts =
            await Contract.find({
                managers: normalizeUsername(user.username)
            }).select("number");

        return contracts.map(contract =>
            contract.number
        );

    }

    return [
        ...new Set(
            (user.access || [])
                .map(accessItem =>
                    accessItem.contractNumber
                )
                .filter(Boolean)
        )
    ];

}

export async function getRequester(req) {

    const username =
        getLoggedUsername(req);

    if (!username) {
        return null;
    }

    return await User.findOne({
        username,
        status: "approved"
    });

}

export function getAccessForContract(
    user,
    contractNumber
) {

    if (!user) {
        return null;
    }

    if (isSuperAdmin(user)) {

        return {
            contractNumber,
            role: "admin",
            plants: ["ALL"]
        };

    }

    const accessItem =
        user.access?.find(item =>
            item.contractNumber === contractNumber
        );

    if (accessItem) {
        return accessItem;
    }

    if (contractNumber === DEFAULT_CONTRACT_NUMBER) {

        return {
            contractNumber,
            role: user.role || "user",
            plants: [user.plant || "SJP"]
        };

    }

    return null;

}

export async function requireContractAccess(
    req,
    res,
    contractNumber
) {

    const requester =
        await getRequester(req);

    if (!requester) {

        res.status(401).json({
            erro: "Usuário autenticado não informado ou não aprovado."
        });

        return null;

    }

    const access =
        getAccessForContract(
            requester,
            contractNumber
        );

    if (access) {

        return {
            requester,
            access
        };

    }

    if (isGestor(requester)) {

        const managedContract =
            await Contract.findOne({
                number: contractNumber,
                managers: normalizeUsername(requester.username)
            });

        if (managedContract) {

            return {
                requester,
                access: {
                    contractNumber,
                    role: "admin",
                    plants: ["ALL"]
                }
            };

        }

    }

    res.status(403).json({
        erro: "Você não tem acesso a este contrato."
    });

    return null;
}

export async function requireContractManager(
    req,
    res,
    contractNumber
) {

    const result =
        await requireContractAccess(
            req,
            res,
            contractNumber
        );

    if (!result) {
        return null;
    }

    const role =
        result.access.role;

    if (
        role !== "admin" &&
        role !== "gestor"
    ) {

        res.status(403).json({
            erro: "Você não tem permissão para administrar este contrato."
        });

        return null;

    }

    return result;

}

export async function requirePlantEditor(
    req,
    res,
    contractNumber,
    plant
) {

    const result =
        await requireContractAccess(
            req,
            res,
            contractNumber
        );

    if (!result) {
        return null;
    }

    const plants =
        result.access.plants || [];

    if (
        !plants.includes("ALL") &&
        !plants.includes(plant)
    ) {

        res.status(403).json({
            erro: "Você não tem permissão para editar esta planta."
        });

        return null;

    }

    return result;

}

export async function getUserManagementContractNumbers(user) {

    if (!user) {
        return [];
    }

    if (isSuperAdmin(user)) {

        const contracts =
            await Contract.find({})
                .select("number");

        return contracts.map(contract =>
            contract.number
        );

    }

    if (isGestor(user)) {

        const contracts =
            await Contract.find({
                managers: normalizeUsername(user.username)
            }).select("number");

        return contracts.map(contract =>
            contract.number
        );

    }

    const adminContractNumbers =
        [
            ...new Set(
                (user.access || [])
                    .filter(accessItem =>
                        accessItem.role === "admin"
                    )
                    .map(accessItem =>
                        accessItem.contractNumber
                    )
                    .filter(Boolean)
            )
        ];

    if (adminContractNumbers.length > 0) {
        return adminContractNumbers;
    }

    if (user.role === "admin") {
        return [DEFAULT_CONTRACT_NUMBER];
    }

    return [];

}

export async function getUserVisibleContractNumbers(user) {

    if (!user) {
        return [];
    }

    if (isSuperAdmin(user)) {

        const contracts =
            await Contract.find({})
                .select("number");

        return contracts.map(contract =>
            contract.number
        );

    }

    if (isGestor(user)) {

        const contracts =
            await Contract.find({
                managers: normalizeUsername(user.username)
            }).select("number");

        return contracts.map(contract =>
            contract.number
        );

    }

    return [
        ...new Set(
            (user.access || [])
                .map(accessItem =>
                    accessItem.contractNumber
                )
                .filter(Boolean)
        )
    ];

}