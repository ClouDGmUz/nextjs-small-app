import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from 'xlsx';
import { Agent } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const confirm = formData.get('confirm') === 'true';
    
    console.log('Upload request received:', { confirm, hasFile: !!file });

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Read the file buffer
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // If not confirmed, return preview data
    console.log('Data extracted from Excel:', { rowCount: data.length });
    if (!confirm) {
      const preview = data.map((row: any) => ({
        name: row.name,
        phoneNumber: (row.phoneNumber || row['phone number'])?.toString(),
        location: row.location,
        status: row.status || 'active',
        telegram: row.telegram || null,
        order: typeof row.order === 'number' ? row.order : 0,
        category: row.category || 'General'
      }));

      return NextResponse.json({
        preview,
        totalRecords: data.length,
        requireConfirmation: true
      });
    }

    const results = {
      success: 0,
      errors: [] as { row: number; error: string }[]
    };

    // Process each row
    console.log('Starting import with confirmation:', { confirm, rowCount: data.length });
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any;
      try {
        // Log the row data to see what we're working with
        console.log(`Processing row ${i+1}:`, row);
        
        // Get phone number from either camelCase or space-separated format
        const phoneNumber = row.phoneNumber || row['phone number'];
        
        // Validate required fields and handle case-sensitivity
        const name = row.name || row.Name;
        const location = row.location || row.Location;
        
        if (!name || !phoneNumber || !location) {
          throw new Error('Name, phone number, and location are required');
        }

        // Create agent with validated data
        await prisma.agent.create({
          data: {
            name: name,
            phoneNumber: phoneNumber.toString(),
            location: location,
            status: row.status || 'active',
            telegram: row.telegram || null,
            order: typeof row.order === 'number' ? row.order : 0,
            category: row.category || 'General'
          }
        });

        results.success++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.log(`Error importing row ${i+1}:`, { error: errorMessage, rowData: row });
        results.errors.push({
          row: i + 2, // Add 2 to account for 1-based indexing and header row
          error: errorMessage
        });
      }
    }

    console.log('Import completed:', { success: results.success, errors: results.errors.length });
    return NextResponse.json({
      message: `Successfully imported ${results.success} agents`,
      errors: results.errors
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}