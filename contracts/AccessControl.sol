
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/IAccessControl.sol";

/**
 * @title AccessControl
 * @dev Role-based access control for the NFTGenerator contract.
 */
contract AccessControl is AccessControl {
    // Define role identifiers
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /**
     * @dev Constructor that sets the deployer as the default admin.
     */
    constructor() {
        _setupRole(ADMIN_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Modifier to check if the caller has the MINTER_ROLE.
     */
    modifier onlyMinter() {
        require(hasRole(MINTER_ROLE, msg.sender), "AccessControl: caller does not have MINTER_ROLE");
        _;
    }

    /**
     * @dev Modifier to check if the caller has the ADMIN_ROLE.
     */
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "AccessControl: caller does not have ADMIN_ROLE");
        _;
    }

    /**
     * @dev Grant MINTER_ROLE to an account.
     * @param account The address to grant the role.
     */
    function grantMinterRole(address account) external onlyAdmin {
        grantRole(MINTER_ROLE, account);
    }

    /**
     * @dev Revoke MINTER_ROLE from an account.
     * @param account The address to revoke the role.
     */
    function revokeMinterRole(address account) external onlyAdmin {
        revokeRole(MINTER_ROLE, account);
    }

    /**
     * @dev Grant ADMIN_ROLE to an account.
     * @param account The address to grant the role.
     */
    function grantAdminRole(address account) external onlyAdmin {
        grantRole(ADMIN_ROLE, account);
    }

    /**
     * @dev Revoke ADMIN_ROLE from an account.
     * @param account The address to revoke the role.
     */
    function revokeAdminRole(address account) external onlyAdmin {
        revokeRole(ADMIN_ROLE, account);
    }

    /**
     * @dev Check if an account has MINTER_ROLE.
     * @param account The address to check.
     * @return True if the account has MINTER_ROLE, false otherwise.
     */
    function isMinter(address account) external view returns (bool) {
        return hasRole(MINTER_ROLE, account);
    }

    /**
     * @dev Check if an account has ADMIN_ROLE.
     * @param account The address to check.
     * @return True if the account has ADMIN_ROLE, false otherwise.
     */
    function isAdmin(address account) external view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }
}
