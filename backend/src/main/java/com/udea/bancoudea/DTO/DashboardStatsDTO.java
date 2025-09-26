package com.udea.bancoudea.DTO;

import java.math.BigDecimal;

public class DashboardStatsDTO {
    private long totalCustomers;
    private BigDecimal totalBalance;
    private BigDecimal averageBalance;

    // Usamos 'long' para el conteo de transacciones
    private long totalTransactions;

    // Constructor vacío (necesario para Spring/JPA)
    public DashboardStatsDTO() {}

    // Constructor completo - debe coincidir con el tipo 'long'
    public DashboardStatsDTO(long totalCustomers, BigDecimal totalBalance, BigDecimal averageBalance, long totalTransactions) {
        this.totalCustomers = totalCustomers;
        this.totalBalance = totalBalance;
        this.averageBalance = averageBalance;
        this.totalTransactions = totalTransactions; // 'long'
    }

    // Getters y Setters para las métricas de clientes y saldo (BigDecimal)
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

    // Getters y Setters para Transacciones
    public long getTotalTransactions() {
        // El getter debe devolver el mismo tipo que la variable (long)
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        // Este setter ya estaba bien para 'long'
        this.totalTransactions = totalTransactions;
    }
}