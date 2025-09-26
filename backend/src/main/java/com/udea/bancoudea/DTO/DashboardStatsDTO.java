package com.udea.bancoudea.DTO;

import java.math.BigDecimal;

public class DashboardStatsDTO {
    private long totalCustomers;
    private BigDecimal totalBalance;
    private BigDecimal averageBalance;

    // Usamos 'long' para el conteo de transacciones
    private long totalTransactions;


    public DashboardStatsDTO() {}
    public DashboardStatsDTO(long totalCustomers, BigDecimal totalBalance, BigDecimal averageBalance, long totalTransactions) {
        this.totalCustomers = totalCustomers;
        this.totalBalance = totalBalance;
        this.averageBalance = averageBalance;
        this.totalTransactions = totalTransactions; // 'long'
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(BigDecimal totalBalance) {
        this.totalBalance = totalBalance;
    }

    public BigDecimal getAverageBalance() {
        return averageBalance;
    }

    public void setAverageBalance(BigDecimal averageBalance) {
        this.averageBalance = averageBalance;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }
}
