package com.example.application.views.dashboard;

import com.vaadin.fusion.Nonnull;

/**
 * Simple DTO class for chart data-series.
 */
public class ChartSeries {

    @Nonnull
    private String name;
    @Nonnull
    private double[] data;

    public ChartSeries(String name, double... data) {
        this.name = name;
        this.data = data;
    }

    public String getName() {
        return name;
    }

    public double[] getData() {
        return data;
    }
}
